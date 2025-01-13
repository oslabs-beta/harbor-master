import React, { useState, useEffect } from 'react';
import ProjectModal from './ProjectModal';
import { useAppDispatch } from './hooks';
import { addProject } from '../common/slices/userSlice';
import { useLocation } from 'react-router-dom';
import ghLogoGray from './images/ghLogoGray.png';
import ghLogoBlue from './images/ghLogoBlue.png';

interface Repo{
  "id": number,
  "node_id": string,
  "name": string,
  "full_name": string,
  "clone_url":string
}

const fieldDetails: { [key: string]: { label: string; subLabel?: string } } = {
  appId: {
    label: 'Application ID',
    subLabel: 'Enter your application ID from Cloudbuild app on Github here.',
  },
  projId: {
    label: 'Project ID',
    subLabel: 'The id for your project',
  },
  projNum: {
    label: 'Project Number',
    subLabel: 'The unique number for your project.',
  },
  saMail: {
    label: 'Service Account Email',
    subLabel: 'Email of the service account used for authentication.',
  },
  compR: {
    label: 'Compute Region',
    subLabel: 'Region where you want your resources to be located ex.(us-central1)',
  },
  compZ: {
    label: 'Compute Zone',
    subLabel: 'Specific zone within the compute region ex.(us-central1-a)',
  },
  ghTok: {
    label: 'GitHub Token',
    subLabel: 'Personal access token for GitHub',
  },
  cName: {
    label: 'Cluster Name',
    subLabel: 'What you want the kubernetes cluster to be named.',
  },
  arName: {
    label: 'Artifact Name',
    subLabel: 'Name of the artifact to be managed MUST BE IN BLANK/BLANK FORMAT Example hb/test',
  },
  npName: {
    label: 'Node Pool Name',
    subLabel: 'What you want the node pool to be named',
  },
  nodeCount: {
    label: 'Node Count',
    subLabel: 'How many nodes you want in your cluster (3 is average)',
  },
  cbConName: {
    label: 'Cloudbuild Connection Name',
    subLabel: 'What you want the Cloudbuild Connection name to be',
  },
  cbRepName: {
    label: 'Cloudbuild Repository Name',
    subLabel: 'What you want the Cloudbuild Repository name to be',
  },
  cbTrgName: {
    label: 'Cloudbuild Trigger Name',
    subLabel: 'What you want the Cloudbuild Trigger name to be',
  },
  branchName: {
    label: 'Branch Name',
    subLabel: 'Name of the branch in your GH repository you want the CI/CD to be based on',
  },
};

const Deployments: React.FC = () => {
  const initialData = {
    appId: '',
    projId: '',
    projNum: '',
    saMail: '',
    compR: '',
    compZ: '',
    ghTok: '',
    cName: '',
    arName: '',
    npName: '',
    nodeCount: '',
    cbConName: '',
    cbRepName: '',
    cbTrgName: '',
    branchName: '',
  };

  const [formDatas, setFormDatas] = useState(initialData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlrDeployedModal, setAlrDeployedModal] = useState(false);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [ghURL, setghURL] = useState<string>();
  const dispatch = useAppDispatch();
  const [hoveredRepo, setHoveredRepo] = useState<string|null>(null);
  const location = useLocation();
  let projectId: number;
  
  useEffect(() => {
    const fetchRepos = async () => {
      const response = await fetch('/api/users/get-repos').then(data=>data.json());
      setRepos(response);
    };
    fetchRepos();
  },[ghURL]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDatas({
      ...formDatas,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRepoSelect = (repoUrl: string) => {
    setghURL(repoUrl)
    setFormDatas(prevState => {
      const updatedState = {
        ...prevState,
        ghURL: repoUrl,
      };
      console.log('Updated formDatas in handleRepoChange:', updatedState);
      return updatedState;
    });
  };

  const createProject = async (info: object): Promise<void> => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(info)) formData.append(key, value as string);
    formData.forEach((value, key) => console.log(`${key}:`, value));

    setLoading(true);

    try {
      const response = await fetch('/api/projects/create-project', {
        method: 'POST',
        body: formData,
      }).then((data) => data.json());
      const { exists, id } = response;
      if (id) projectId = id;
      if (exists === true) {
        setAlrDeployedModal(true);
        return;
      }

      const deploy = await fetch(`/api/projects/deploy/${id}`, {
        method: 'POST',
      });
      if (deploy.status === 500) alert('Project was not deployed; there was an error');
      else {
        alert('Project Successfully deployed');
        dispatch(addProject(id));
        window.location.assign('/account');
      }
    } catch (error) {
      console.error('Error deploying project', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAndContinue = async () => {
    setLoading(true);
    try {
      await fetch(`/api/projects/deploy/${projectId}`, {
        method: 'POST',
      }).then((data) => console.log(data));
    } catch (error) {
      console.error('Error deleting and continuing', error);
    } finally {
      setLoading(false);
      setAlrDeployedModal(false); // Close modal after action
    }
  };

  const handleCancel = () => {
    setAlrDeployedModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formPayload = {
      ...formDatas,
      file: selectedFile,
      ghURL, // Add selected repository to form payload
    };

    console.log('Form submitted:', formPayload);
    createProject(formPayload);
  };

  return (
    <div className=''>
      <h1 className='text-2xl font-bold mb-4 text-white text-center'>Deployment Form</h1>
      <form
        onSubmit={handleSubmit}
        className='max-w-3xl mx-auto p-6 rounded-lg border-custom-blue border-3 h-[calc(100vh-12rem)] overflow-y-auto pb-8 scrollbar-hide'
      >
        {Object.keys(formDatas).map((key) => {
          if(key!=='ghURL'){
          return(
            <div key={key} className='flex flex-col'>
              <label
                htmlFor={key}
                className='text-lg font-semibold mb-2 capitalize text-blue-text'
              >
                {fieldDetails[key]?.label ||
                  key.replace(/([A-Z])/g, ' $1').toUpperCase()}
              </label>
              {fieldDetails[key]?.subLabel && (
                <p className='text-sm text-sub-text mb-2'>
                  {fieldDetails[key].subLabel}
                </p>
              )}
              <input
                type='text'
                id={key}
                name={key}
                value={formDatas[key as keyof typeof formDatas]}
                onChange={handleChange}
                className='p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-input-bg text-sub-text'
              />
            </div>)
          }else return null;
        })}

        {/* GitHub Repos Dropdown */}
        <div className='flex flex-col'>
          <label
            htmlFor='ghURL'
            className='text-lg font-semibold mb-2 capitalize text-blue-text'
          >
            Select GitHub Repository
          </label>
          <ul className="bg-dark-gray rounded-lg max-h-60 overflow-auto">
            {repos.map((repo: Repo) => (
              <li
              onMouseEnter={()=>{setHoveredRepo(repo.clone_url)}}
              onMouseLeave={()=>{setHoveredRepo(null)}}
                key={repo.id}
                className={`cursor-pointer rounded-lg hover:bg-blue-text hover:text-git-repo-text p-2 flex items-center ${ghURL === repo.clone_url ? 'bg-blue-text text-git-repo-text':'text-sub-text'}`}
                onClick={() => {handleRepoSelect(repo.clone_url)}}
              >
                {ghURL === repo.clone_url || hoveredRepo === repo.clone_url ? 
                <img
                src={ghLogoBlue}
                alt="GitHub Logo"
                id={ghURL}
                className={`h-5 w-5 mr-2`}
              />
              :<img
              src={ghLogoGray}
              alt="GitHub Logo"
              id={ghURL}
              className={`h-5 w-5 mr-2`}
            />}
                
                {repo.full_name}
              </li>
            ))}
          </ul>
        </div>

        {/* File Upload Input */}
        <div className='flex flex-col'>
          <label
            htmlFor='fileUpload'
            className='text-lg font-semibold mb-2 capitalize text-blue-text'
          >
            Upload File
          </label>
          <p className='text-sm text-sub-text mb-2'>Choose a file to upload.</p>
          <input
            type='file'
            id='fileUpload'
            name='fileUpload'
            accept='.json'
            onChange={handleFileChange}
            className='p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sub-text'
          />
        </div>

        <button
          type='submit'
          className='mt-4 bg-custom-blue text-white py-3 px-6 rounded-lg shadow-lg font-semibold'
        >
          {!loading ? 'Deploy':'Deploying...'}
        </button>
        {loading && 
        <ProjectModal
          onDeleteAndContinue={handleDeleteAndContinue}
          onClose={handleCancel}  
          show={loading}
          type={'deploying'}
        />}
      </form>

      {/* Modal for deployment */}
      {showAlrDeployedModal && (
        <ProjectModal
          onDeleteAndContinue={handleDeleteAndContinue}
          onClose={handleCancel}
          show={showAlrDeployedModal}
          type={'alrDeployed'}
        />
      )}
    </div>
  );
};

export default Deployments;
