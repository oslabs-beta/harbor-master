import { AsyncMiddleware } from 'types/Middleware';
import { ProjectModel, UserModel } from '../config/mongoConfig';
import ServiceAccountCredentials from 'interfaces/ServiceAccountCredentials';
import EncryptionService from '../services/EncryptionService';
import UploadService from '../services/UploadService';
import DeploymentService from '../services/DeploymentService';
import UserDeploymentOptions from 'interfaces/UserDeploymentOptions';
import DeploymentProperties from 'interfaces/DeploymentProperties';
import { ContinuousColorLegend } from '@mui/x-charts';
import { Next } from 'react-bootstrap/esm/PageItem';
import { exitCode, nextTick } from 'process';
import childProcess, { spawn, ChildProcess, exec } from 'child_process';
import path from 'path';
import { start } from 'repl';
import { json } from 'body-parser';
import { tokenToString } from 'typescript';
import { url } from 'inspector';

const fs = require('fs');


interface GcpServiceAccount {
  name: string;
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

interface Project {
  _id: string;
  appInstallationId: string;
  gcpProjectId: string;
  gcpProjectNumber: number;
  gcpServiceAcctEmail: string;
  gcpRegion: string;
  gcpComputeZone: string;
  gcpServiceAccounts: GcpServiceAccount[];
  githubUrl:string;
  isDeployed:Boolean;
}

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

const createProject: AsyncMiddleware = async (req, res, next) => {
  console.log('in create project');

  const encryptionService = new EncryptionService();
  const uploadService = new UploadService();
  const deploymentService = new DeploymentService();
  try {
    deploymentService.validateProperties({ ...req.body });
  }
  catch (error) {
    return next({ 
      log: `projectController.createProject: missing deployment properties ${error}`,
      message: { err: 'All config properties must have a value in order to save project' } 
    });
  }

  const {
    appId: appInstallationId,
    projId: gcpProjectId,
    projNum: gcpProjectNumber,
    saMail: gcpServiceAcctEmail,
    compR: gcpRegion,
    compZ: gcpComputeZone,
    ghTok: githubToken,
    ghURL: githubUrl,
    cName: clusterName, 
    arName: artifactRegistryName, 
    npName: nodePoolName, 
    nodeCount, 
    cbConName: cloudBuildConnectionName, 
    cbRepName: cloudBuildRepoName,
    cbTrgName: cloudBuildTriggerName,
    branchName
  } = req.body;

  const userOptions: UserDeploymentOptions = {
    clusterName,
    artifactRegistryName,
    nodePoolName,
    nodeCount,
    cloudBuildConnectionName,
    cloudBuildRepoName,
    cloudBuildTriggerName,
    branchName
  };

  const gcpServiceAccounts: ServiceAccountCredentials[] = [];
  const files = req.files as Array<Express.Multer.File>;

  try {
    for (const file of files) {
      const name = file.originalname;
      console.log(file.path,'THIS IS FILE PATH');
      const credentials = uploadService.parseFileContents(file.path);
      const encryptedCredentials = encryptionService.setEncryptedCredentials(
        credentials,
        name
      );
      gcpServiceAccounts.push(encryptedCredentials);
    }
  
    const createdProject = await ProjectModel.create({ 
      // userId,
      appInstallationId,
      gcpProjectId,
      gcpProjectNumber,
      gcpServiceAcctEmail,
      gcpRegion,
      gcpComputeZone,
      gcpServiceAccounts,
      deploymentOptions: userOptions,
      terraformState: null,
      githubToken: encryptionService.encrypt(githubToken),
      githubUrl,
      isDeployed:false
    });

    res.locals.id = createdProject._id;
    return next();
  } catch (error) {
    console.log('deleting because of an error');
    await ProjectModel.findOneAndDelete({githubUrl:githubUrl});
    return next({
      log: `projectController.createProject: ${error}`,
      message: { err: 'Server error creating new project' },
    });
  }
};

const checkProject: AsyncMiddleware = async (req,res,next) => {
  console.log('in check project');
  const {
    appId: appInstallationId,
    projId: gcpProjectId,
    projNum: gcpProjectNumber,
    saMail: gcpServiceAcctEmail,
    compR: gcpRegion,
    compZ: gcpComputeZone,
    ghTok: githubToken,
    ghURL: githubUrl,
    cName: clusterName, 
    arName: artifactRegistryName, 
    npName: nodePoolName, 
    nodeCount, 
    cbConName: cloudBuildConnectionName, 
    cbRepName: cloudBuildRepoName,
    cbTrgName: cloudBuildTriggerName,
    branchName,
  } = req.body;

  const project = await ProjectModel.findOne({githubUrl:githubUrl}).lean() as Project;


  if(project!==null){
    console.log('isDeployed:',project.isDeployed);
    if(project.githubUrl === githubUrl){
      console.log('already exists');
      // const token = req.cookies.githubAuthToken;
      // const githubHandle = await fetch('https://api.github.com/user', {
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // }).then(data=>data.json());
      return res.json({id:project._id.toString(),exists:true});
    }
  }
  console.log('creating project in database')
  return next();
}

const getProjectById: AsyncMiddleware = async (req, res, next) => {
  const { id } = req.params;
  console.log('id: ', id)
  try {
    const project = await ProjectModel.findOne({ _id: id }).exec();

    if (!project)
      return next({
        log: 'projectController.getProjectById: Project does not exist',
        message: { err: 'Project does not exist' },
      });

    const encryptionService = new EncryptionService();

    const { gcpServiceAccounts } = project;
    const githubToken: string = encryptionService.decrypt(project.githubToken);

    const decryptedGcpServiceAccounts: ServiceAccountCredentials[] = [];

    for (const account of gcpServiceAccounts) {
      const decryptedCredentials =
        encryptionService.setDecryptedCredentials(account);
      decryptedGcpServiceAccounts.push(decryptedCredentials);
    }

    res.locals.project = Object.assign(project, {
      githubToken: githubToken,
      gcpServiceAccounts: decryptedGcpServiceAccounts,
    });

    return next();
  } catch (error) {
    return next({
      log: `projectController.getProjectById: ${error}`,
      message: { err: 'Server error retrieving project' },
    });
  }
};

const deleteFromWorkSpcAndDb = async (githubHandle:string,githubUrl:string) => {
  try{
    const parts = githubUrl.split('/');
    const repoName = parts[parts.length-1].replace('.git', '');
    const fullCommand = `xterm -e "cd customer && terraform workspace select default && terraform workspace delete ${githubHandle}-${repoName}"`
    const child:ChildProcess = spawn(fullCommand,{shell:true});
    const deletedProj = await ProjectModel.findOneAndDelete({githubUrl:githubUrl})
    await new Promise<void>((resolve,reject) => {
      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error('Child process failed'));
        }
      });
    })
    return 'success';
  }catch(error){
    return(error); 
  }
}

const deployProject: AsyncMiddleware = async (req, res, next) => {

  console.log('IN DEPLOY PROJECT');

  const { project } = res.locals;
  const projectId = project._id;
  const githubHandle = res.locals.username;

  const deploymentService = new DeploymentService();

  const {
    appInstallationId,
    gcpProjectId,
    gcpProjectNumber,
    gcpServiceAcctEmail,
    gcpRegion,
    gcpComputeZone,
    gcpServiceAccounts,
    githubToken,
    githubUrl,
    deploymentOptions
  } = project;

  const deploymentProperties: DeploymentProperties = {
    appInstallationId,
    gcpProjectId,
    gcpProjectNumber,
    gcpServiceAcctEmail,
    gcpRegion,
    gcpComputeZone,
    gcpServiceAccounts,
    githubToken,
    githubUrl,
    ...deploymentOptions
  };

  try {
    console.log('BUILDING TERRAFORM FILE');
    deploymentService.buildTerraformFile(deploymentProperties);
  }
  catch (error) {
    console.log('sending error');
    return next({
      log: `deploymentService.buildTerraformFile: ${error}`,
      message: { err: 'Server error occurred during deployment' }
    })
  }
  const parts = githubUrl.split('/');
  const repoName = parts[parts.length-1].replace('.git', '');
  console.log('repo name in projController:',repoName);
  deploymentService.executeInXterm(`terraform init && terraform workspace new ${githubHandle}-${repoName} && terraform workspace select ${githubHandle}-${repoName} && terraform plan && terraform apply -auto-approve && terraform workspace select default`, async (error, output) => {
    if (error) {
      console.log('Deleting in DeployProject because of error');
      console.error(error);
      await deleteFromWorkSpcAndDb(githubHandle,githubUrl);
      return res.redirect(`/delete-project/${projectId}`);
    }
    if (!output.includes('Error') && !output.includes('no output') && output!=='') {
      console.log('output: ', output);
      const user = await UserModel.findOneAndUpdate({githubHandle:githubHandle},{ $push: { projects: projectId } },{ new: true, useFindAndModify: false });
  
      const projectUpdated = await ProjectModel.findOneAndUpdate({_id:projectId},{isDeployed:true},{new:true,useFindAndModify:false});

      console.log(user,'new user');
      console.log(projectUpdated,'new project');
      // console.log('deleting file...');
      return next();
    }else{
      await ProjectModel.findOneAndDelete({_id:projectId})
      await UserModel.findOneAndUpdate({githubHandle:githubHandle},{ $pull: { projects: projectId } },{ new: true, useFindAndModify: false });
      const error = new Error('error in deploy project');
      return res.status(500).send('error project not deployed');
    }
  });



  // const tfStateContents = fs.readFileSync('../../../customer/terraform.tf.state', 'utf-8');
  // const terraformState = JSON.parse(tfStateContents);

  // try {
  //   deploymentService.updateDbPostDeployment(projectId, userOptions, terraformState);
  // }
  // catch (error) {
  //   return next({ log: `deploymentService.updateDbPostDeployment: ${error}`, message: { err: 'Server error occurred while saving your deployment options' } });
  // }

  // return next();
}

const getEndpoint:AsyncMiddleware = async (req,res,next) => {
  const id = req.params.id;
  const token = res.locals.token;
  const pathToKey = res.locals.pathToKey;
  
  const deploymentService = new DeploymentService();

  const endpoint:string = await deploymentService.getEndpoint(id,pathToKey);

  console.log(endpoint);
  return res.json({'endpoint':endpoint});
}

const deleteProject:AsyncMiddleware = async(req,res,next) => {
  const {project} = res.locals;
  const deploymentService = new DeploymentService();
  console.log('deleting this project:',project);
  const githubUrl = project.githubUrl;
  const githubHandle = res.locals.username;
  const projectId = project._id;

  try{
    const parts = githubUrl.split('/');
    const repoName = parts[parts.length-1].replace('.git', '');

    console.log('isDeployed in deleteProject:', project.isDeployed);
    if(project.isDeployed==='false'){
      await deleteFromWorkSpcAndDb(githubHandle,githubUrl);
      return next();
    }

    console.log('repoName:',repoName);
    const result = await new Promise<string>((resolve,reject)=>{
      deploymentService.executeInXterm(`terraform workspace select ${githubHandle}-${repoName} && terraform destroy --auto-approve && terraform workspace select default && terraform workspace delete ${githubHandle}-${repoName}`, async (error, output) => {
        if (error) {
          console.log(error);
          return reject(error)
        }
        console.log(!output.includes('Error') && !output.includes('no output') && output!=='')
        if (!output.includes('Error')) {
          const user = await UserModel.findOneAndUpdate({githubHandle:githubHandle},{ $pull: { projects: projectId } },{ new: true, useFindAndModify: false });
      
          const projectDeleted = await ProjectModel.findOneAndDelete({_id:projectId});
  
          console.log(user,'new user');
          console.log('deleted project:',projectDeleted);
          return resolve('success');
        }
      });
    })

  console.log('result:',result);
  if(result==='success') console.log('result is strictly equal to success');
  if(result==='success') return next();
  else return next(new Error('Error in deleteProject'));

  }catch(error){
    return next(error);
  };

}

const generateKeyFile:AsyncMiddleware = async(req,res,next)=>{
  const id = req.params.id;

  const encryptionService = new EncryptionService();

  console.log('IN GENERATE KEY FILE');

  const {name, ...project} = await ProjectModel.findOne({_id:id}).then(data=>data?.gcpServiceAccounts[0]) as ServiceAccountFile;

  const pathToRoot = path.resolve(__dirname,'../','../','../');

  const pathToKey = `${pathToRoot}/uploads/${id}.json`;


  res.locals.pathToKey = pathToKey;
  res.locals.pathToRoot = pathToRoot;

  project['type'] = encryptionService.decrypt(project['type']);
  project['project_id'] = encryptionService.decrypt(project['project_id']);
  project['private_key_id'] = encryptionService.decrypt(project['private_key_id']);
  project['private_key'] = encryptionService.decrypt(project['private_key']);
  project['client_email'] = encryptionService.decrypt(project['client_email']);
  project['client_id'] = encryptionService.decrypt(project['client_id']);
  project['auth_uri'] = encryptionService.decrypt(project['auth_uri']);
  project['token_uri'] = encryptionService.decrypt(project['token_uri']);
  project['auth_provider_x509_cert_url'] = encryptionService.decrypt(project['auth_provider_x509_cert_url']);
  project['client_x509_cert_url'] = encryptionService.decrypt(project['client_x509_cert_url']);

  res.locals.projectFile = project;
  const jsonString = JSON.stringify(project, null, 2);

  await fs.writeFileSync(pathToKey,jsonString,'utf-8');

  return next();
}

const getToken:AsyncMiddleware = async(req,res,next)=>{
  const pathToKey = res.locals.pathToKey;
  const projectFile = res.locals.projectFile;
  const pathToRoot = res.locals.pathToRoot;

  const pathToToken = `${pathToRoot}/customer/access-token`;

  console.log(pathToToken,'PATH TO TOKEN');

  console.log(pathToKey,'PATH TO KEY');

  const fullCommand = `xterm -e "gcloud auth activate-service-account --key-file=${pathToKey} && gcloud auth print-access-token --impersonate-service-account=${projectFile['client_email']} > ${pathToToken} && gcloud auth revoke > output2.txt 2>&1"`;
    const child: ChildProcess = spawn(fullCommand, { shell: true })
    child.on('close',async ()=>{
      if (await fs.existsSync(pathToToken)) {
        const token = await fs.readFileSync(pathToToken, 'utf-8');
    
        fs.unlinkSync(pathToToken);

        res.locals.token = token;
    
        return next();
      }else{
        const error = new Error('Error getting token');
        return next(error);
      }
    }
  )
}

const getProjMetrics:AsyncMiddleware = async(req,res,next)=>{
  try{
    const startTime = req.params.startTime;
    const endTime = req.params.endTime;
    const token = res.locals.token;
    const pathToKey = res.locals.pathToKey;
    const projectFile = res.locals.projectFile;

    if (token) {
      fs.unlinkSync(pathToKey);
      const metricTypes = ["memory/balloon/ram_used","cpu/utilization","disk/write_bytes_count","disk/read_bytes_count","network/sent_bytes_count"];
      const requests = metricTypes.map(async (metricType) => 
        await fetch(`https://monitoring.googleapis.com/v3/projects/${projectFile['project_id']}/timeSeries?filter=metric.type="compute.googleapis.com/instance/${metricType}"&interval.startTime=${startTime}&interval.endTime=${endTime}`, {
          headers: {Authorization : `Bearer ${await token.trim()}`}
        })
          .then(data=>data.json()).then(data=>data.timeSeries)
      );

      const [ memoryUsage, cpuUsage, diskWrite, diskRead, networkEgress ] = await Promise.all(requests);

      const obj = {
        memoryUsage,
        cpuUsage,
        diskWrite,
        diskRead,
        networkEgress
      }

      res.locals.metrics = obj;

      return next();
    } else {
      const error = new Error('file does not exist');
      return next(error);
    }
  }catch(error){
    return next(error);
  }
}
module.exports = {
  createProject,
  getProjectById,
  deployProject,
  checkProject,
  getEndpoint,
  deleteProject,
  getProjMetrics,
  getToken,
  generateKeyFile,
}