import fs from 'fs';
import { ProjectModel } from '../config/mongoConfig';
import ServiceAccountCredentials from 'interfaces/ServiceAccountCredentials';
import encryptionService from '../services/EncryptionService';
import uploadService from '../services/UploadService';
import deploymentService from '../services/DeploymentService';
import UserDeploymentOptions from 'interfaces/UserDeploymentOptions';
import DeploymentProperties from 'interfaces/DeploymentProperties';
import { NextFunction, Request, Response } from 'express';

class ProjectController {
  constructor() { }

  public async createProject(req: Request, res: Response, next: NextFunction) {

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
        githubUrl
      });

      res.locals.id = createdProject._id;
      return next();
    } catch (error) {
      return next({
        log: `projectController.createProject: ${error}`,
        message: { err: 'Server error creating new project' },
      });
    }
  };

  public async getProjectById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    console.log('id: ', id)
    try {
      const project = await ProjectModel.findOne({ _id: id }).exec();

      if (!project)
        return next({
          log: 'projectController.getProjectById: Project does not exist',
          message: { err: 'Project does not exist' },
        });

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

  public async deployProject(req: Request, res: Response, next: NextFunction) {
    const { project } = res.locals;
    const projectId = project._id;

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
      deploymentService.buildTerraformFile(deploymentProperties);
    }
    catch (error) {
      return next({
        log: `deploymentService.buildTerraformFile: ${error}`,
        message: { err: 'Server error occurred during deployment' }
      })
    }

    deploymentService.executeInXterm('terraform init && terraform plan && terraform apply -auto-approve', (error, output) => {
      if (error) {
        console.log(error);
        // fs.unlink('terraform.tf.state',()=>{});
        // fs.unlink('terraform.tf.state.backup',()=>{});
        return next({
          log: `deploymentService.executeInXterm: ${error.message}`,
          message: { err: 'Server error occurred during deployment' }
        });
      }
      if (output) {
        console.log('output: ', output);
        return next();
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
}

export default new ProjectController();
