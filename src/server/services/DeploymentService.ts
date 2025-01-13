import path from 'path';
import fs from 'fs';
import childProcess, { spawn, ChildProcess, exec } from 'child_process';
import UserDeploymentOptions from 'interfaces/UserDeploymentOptions';
import Project from 'interfaces/ProjectProperties';
import { ProjectModel } from '../config/mongoConfig';
import DeploymentProperties from 'interfaces/DeploymentProperties';
import ProjectConfigSchema from '../db/ProjectConfigSchema';
import { idText } from 'typescript';
import EncryptionService from './EncryptionService';
import { Z_FIXED } from 'zlib';
import e from 'express';
const getMetrics = require('../utility_functions/extract_metrics');


interface ServiceAccountFile{
  name: string
  type: string
  project_id: string
  private_key_id: string
  private_key: string
  client_email: string
  client_id: string
  auth_uri: string
  token_uri: string
  auth_provider_x509_cert_url: string
  client_x509_cert_url: string
  universe_domain:string
}

class DeploymentService {
  outputFilePath: string;
  exitFilePath: string;

  constructor() { 
    this.outputFilePath = path.join(__dirname,'../../../customer', 'output.log');
    this.exitFilePath = path.join(__dirname,'../../../customer', 'output.log.exit');
  }

  validateProperties(properties: object) {
    const validDeploymentProperties = [
      'appId',
      'projId',
      'projNum',
      'saMail',
      'compR',
      'compZ',
      'ghTok',
      'ghURL',
      'cName',
      'arName',
      'npName',
      'nodeCount',
      'cbConName',
      'cbRepName',
      'cbTrgName',
      'branchName'
  ];

    let missingProps = '';
    validDeploymentProperties.forEach(prop => {
      if (!properties.hasOwnProperty(prop)) missingProps += `${prop},`
    });
    if (missingProps !== '') throw new Error(missingProps);
  }

  executeInXterm(command: string, callback: (error: Error | null, output: string) => void): void {

    try{

      const fullCommand = `xterm -e "cd customer && ${command} > ${this.outputFilePath} 2>&1 || echo 'Command failed or produced no output' >> ${this.outputFilePath}; echo \$? > ${this.exitFilePath}"`;

      console.log(`Executing command: ${fullCommand}`);

      const child: ChildProcess = spawn(fullCommand, { shell: true });

      child.stdout?.on('data', (data) => {
        callback(null, data);
      });

      child.stderr?.on('error', (error) => {
        callback(error, '')
      })

      child.on('error', (error: Error) => {
        console.error('Error occurred in xterm:', error);
        callback(error, '');
      });

      child.on('exit', () => {
        // Read the exit code from the file
        fs.readFile(this.exitFilePath, 'utf8', (err: Error | null, exitCode: string | Buffer) => {
          if (err) {
            callback(err, '');
            return;
          }

          // Read the output file
          fs.readFile(this.outputFilePath, 'utf8', (err: Error | null, output: string | Buffer) => {
            if (err) {
              console.error('Error reading output file:', err);
              callback(err, '');
              return;
            }

            if(output.toString().includes('failed')){
              callback(new Error(output.toString()),output.toString());
            }else if(output.toString().includes('Error:')){
              callback(new Error(`Command failed \n${output.toString().slice(output.toString().indexOf('Error:'))}`), output.toString().slice(output.toString().indexOf('Error:')));
            }else{
              console.log('calling callback');
              callback(null, output.toString());
            }
          });
        });
      });
    }catch(error){
      
    }
  }

  buildTerraformFile(deploymentProperties: DeploymentProperties): void {
    fs.writeFile(this.outputFilePath, '', (err) => { if (err) console.log(err) });
    fs.writeFile(this.exitFilePath, '', (err) => { if (err) console.log(err) });
    fs.readFile(path.join(__dirname, '../../../copy/main.tf'), 'utf8', (err: Error | null, data: string) => {
      if (err) throw err;

      const serviceAcctCredentials = deploymentProperties.gcpServiceAccounts[0]; // tf file can only handle one service account

      const creds = JSON.stringify(serviceAcctCredentials)

      let result = data.replace(/APP_INSTALLATION_ID/g, deploymentProperties.appInstallationId)
        .replace(/PROJECT_ID/g, deploymentProperties.gcpProjectId)
        .replace(/PROJECT_NUMBER/g, String(deploymentProperties.gcpProjectNumber))
        .replace(/SA_EMAIL/g, deploymentProperties.gcpServiceAcctEmail)
        .replace(/COMPUTE_REGION/g, deploymentProperties.gcpRegion)
        .replace(/COMPUTE_ZONE/g, deploymentProperties.gcpComputeZone)
        .replace(/SA_credentials/g, creds)
        .replace(/GH_TOKEN/g, deploymentProperties.githubToken)
        .replace(/GH_URL/g, deploymentProperties.githubUrl)
        .replace(/cName/g, deploymentProperties.clusterName)
        .replace(/arName/g, deploymentProperties.artifactRegistryName)
        .replace(/npName/g, deploymentProperties.nodePoolName)
        .replace(/nodeCount/g, String(deploymentProperties.nodeCount))
        .replace(/cbConName/g, deploymentProperties.cloudBuildConnectionName)
        .replace(/cbRepName/g, deploymentProperties.cloudBuildRepoName)
        .replace(/cbTrgName/g, deploymentProperties.cloudBuildTriggerName)
        .replace(/branchName/g, deploymentProperties.branchName);
        
      fs.writeFile(path.join(__dirname, '../../../customer/main.tf'), result, 'utf8', (err: Error | null) => {
        if (err) throw(err)
      });
    });
  }

  async updateDbPostDeployment(projectId: string, userOptions: UserDeploymentOptions, terraformState: object) {
    try {
      await ProjectModel.findOneAndUpdate(
        { _id: projectId },
        { terraformState, deploymentOptions: userOptions }
      );
    }
    catch (error) {
      throw error;
    }
  }

  async getEndpoint(id:string,pathToKey:string){
    let endpoint = 'error in get endpoint'
    try{
      const pathToEndpoint = path.join(__dirname,'../','../','../','/customer','endpoint.txt');
      const project = await ProjectModel.findOne({_id:id});
      console.log(project?.deploymentOptions.clusterName,'in getEndpoint');
      console.log(pathToEndpoint,'PATH TO ENDPOINT IN getEndpoint');
      console.log(pathToKey,"PATH TO KEY IN getEndpoint");

      console.log('Project:',project);

      if(project){
        const fullCommand = `gcloud auth activate-service-account --key-file=${pathToKey} && gcloud container clusters get-credentials ${project.deploymentOptions.clusterName} --zone ${project.gcpComputeZone} --project ${project.gcpProjectId} && kubectl get service nodeapp-load-balancer-service -n default -o jsonpath='{.status.loadBalancer.ingress[0].ip}'> ${pathToEndpoint} && gcloud auth revoke`
        await new Promise<void>((resolve, reject) => {
          const child: ChildProcess = spawn('xterm', ['-e', fullCommand], { shell: true });
  
          child.on('close', (code) => {
            if (code === 0) {
              resolve();
            } else {
              reject(new Error('Child process failed'));
            }
          });
  
          child.on('error', (err) => reject(err));
        });
  
        fs.unlinkSync(pathToKey);
  
        if (fs.existsSync(pathToEndpoint)) {
          endpoint = fs.readFileSync(pathToEndpoint, 'utf8').trim();

          console.log('Deleting endpoint file...');
          fs.unlinkSync(pathToEndpoint);
          console.log('Endpoint file deleted');

          if(endpoint==='') return 'error in get endpoint';
        }
      }
    }catch{
      return 'error in get endpoint'
    }
    return endpoint;
  }

  async deleteProject(githubHandle:string,githubRepo:string){
    try{
      const fullCommand = `xterm -e "cd customer && workspace select ${githubHandle}-${githubRepo} && terraform destroy --auto-approve`;
      const child: ChildProcess = spawn(fullCommand,{shell:true});
      return 'success';
    }catch{
      return 'error in delete project'
    }
  }

}


export default DeploymentService;