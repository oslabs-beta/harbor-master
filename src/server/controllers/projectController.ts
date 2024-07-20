import fs from 'fs';
import path from 'path';
import Project from 'interfaces/Project';
import { AsyncExpressMethod } from 'types/ExpressMethods';
import { ProjectModel } from '../config/mongoConfig';
import ServiceAccountCredentials from 'interfaces/ServiceAccountCredentials';
import EncryptionService from '../services/EncryptionService';
import UploadService from '../services/UploadService';
import { Document } from 'mongoose';

export const createProject: AsyncExpressMethod = async (req, res, next) => {
  const encryptionService = new EncryptionService();
  const uploadService = new UploadService();
  // mock project data for now
  const mockProjectData = { 
    userId: 'test',
    appInstallationId: 'appInst1',
    gcpProjectId: 'gcpProjId1',
    gcpProjectNumber: 1,
    gcpServiceAcctEmail: 'service-acct@mock.com',
    gcpRegion: 'us-mars1',
    gcpComputeZone: 'computeZone1',
    githubToken: 'ghToken1',
    githubUrl: 'ghUrl1' }
  const { userId, appInstallationId, gcpProjectId, gcpProjectNumber, gcpServiceAcctEmail, gcpRegion, gcpComputeZone, githubToken, githubUrl } = mockProjectData;

  const gcpServiceAccounts: ServiceAccountCredentials[] = [];
  const files = req.files as Array<Express.Multer.File>
 
  try {
    for (const file of files) {
      const name = file.originalname;
      const credentials = uploadService.parseFileContents(file.path);
      const encryptedCredentials = encryptionService.setEncryptedCredentials(credentials, name);
      gcpServiceAccounts.push(encryptedCredentials);
    }
  
    const createdProject = await ProjectModel.create(
      { 
        userId,
        appInstallationId,
        gcpProjectId,
        gcpProjectNumber,
        gcpServiceAcctEmail,
        gcpRegion,
        gcpComputeZone,
        gcpServiceAccounts,
        githubToken: encryptionService.encrypt(githubToken),
        githubUrl,
        vertices: [],
        edges: []
      }
    );
    res.locals.id = createdProject._id;
    return next();
  } 
  catch (error) {
    return next('error with create'); // invoke global error handler
  }
}

export const getProjectById: AsyncExpressMethod = async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await ProjectModel.findOne({_id: id }).exec();

    if (!project) return next('no project'); // invoke global error handler

    const encryptionService = new EncryptionService();

    const { gcpServiceAccounts } = project;
    const githubToken: string = encryptionService.decrypt(project.githubToken);

    const decryptedGcpServiceAccounts: ServiceAccountCredentials[] = [];

    for (const account of gcpServiceAccounts) {
      const decryptedCredentials = encryptionService.setDecryptedCredentials(account);
      decryptedGcpServiceAccounts.push(decryptedCredentials);
    }

    res.locals.project = Object.assign(project, { githubToken: githubToken, gcpServiceAccounts: decryptedGcpServiceAccounts });

    return next();
  }
  catch (error) {
    return next('error with get')
    // invoke global error handler
  }
}

export const editProjectState: AsyncExpressMethod = async (req, res, next) => {
  const { id } = req.params;
  return next();
}