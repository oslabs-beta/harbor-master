import { AsyncMiddleware } from 'types/Middleware';
import { ProjectModel } from '../config/mongoConfig';
import ServiceAccountCredentials from 'interfaces/ServiceAccountCredentials';
import EncryptionService from '../services/EncryptionService';
import UploadService from '../services/UploadService';

export const createProject: AsyncMiddleware = async (req, res, next) => {
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
    githubUrl: 'ghUrl1',
    vertices: [
      { id: 1,
        resourceType: 'pod',
        position: [1, 2],
        data: {}
      },
      { id: 2,
        resourceType: 'pod',
        position: [3, 4],
        data: {}
      }
    ],
    edges: [
      { id: 1,
        endpoints: [[1,2], [3,4]]
      }
    ] 
  }
  const { userId, appInstallationId, gcpProjectId, gcpProjectNumber, gcpServiceAcctEmail, gcpRegion, gcpComputeZone, githubToken, githubUrl, vertices, edges } = mockProjectData;

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
        vertices,
        edges
      }
    );
    res.locals.id = createdProject._id;
    return next();
  } 
  catch (error) {
    return next({ log: `projectController.createProject: ${error}`, message: { err: 'Server error creating new project' } });
  }
}

export const getProjectById: AsyncMiddleware = async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await ProjectModel.findOne({_id: id }).exec();

    if (!project) return next({ log: 'projectController.getProjectById: Project does not exist', message: { err: 'Project does not exist' } });

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
    return next({ log: `projectController.getProjectById: ${error}`, message: { err: 'Server error retrieving project' } });
  }
}

export const editProjectState: AsyncMiddleware = async (req, res, next) => {
  const { id } = req.params;
  // figure out what to do with this
  return next();
}