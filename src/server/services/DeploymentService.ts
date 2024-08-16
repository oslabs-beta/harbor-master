import path from 'path';
import fs from 'fs';
import childProcess, { spawn, ChildProcess, exec } from 'child_process';
import UserDeploymentOptions from 'interfaces/UserDeploymentOptions';
import Project from 'interfaces/ProjectProperties';
import { ProjectModel } from '../config/mongoConfig';
import DeploymentProperties from 'interfaces/DeploymentProperties';

class DeploymentService {
  outputFilePath: string;
  exitFilePath: string;

  constructor() { 
    this.outputFilePath = path.join(__dirname,'../../../customer', 'output.log');
    this.exitFilePath = path.join(__dirname,'../../../customer', 'output.log.exit');
  }

  validateProperties(properties: object) {
    console.log(properties);
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
    const fullCommand = `xterm -e "cd customer && ${command} > ${this.outputFilePath} 2>&1; echo $? > ${this.exitFilePath}"`;

    console.log(`Executing command: ${fullCommand}`);

    const child: ChildProcess = spawn(fullCommand, { shell: true });

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

          if (!output.toString().includes('Error:')) {
            callback(null, output.toString());
          } else {
            callback(new Error(`Command failed \n${output.toString().slice(output.toString().indexOf('Error:'))}`), output.toString().slice(output.toString().indexOf('Error:')));
          }
        });
      });
    });
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
}

export default DeploymentService;