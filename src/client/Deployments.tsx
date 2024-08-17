import { nextTick } from 'process';
import React, { useState } from 'react';

const fieldDetails: { [key: string]: { label: string; subLabel?: string } } = {
  appId: {
    label: 'Application ID',
    subLabel: 'Enter your application ID here.',
  },
  projId: {
    label: 'Project ID',
    subLabel: 'Enter the project ID associated with your application.',
  },
  projNum: {
    label: 'Project Number',
    subLabel: 'The unique number for the project.',
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
    subLabel: 'Personal access token for GitHub API access.',
  },
  ghURL: {
    label: 'GitHub Repository URL',
    subLabel: 'URL of the GitHub repository.',
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
    subLabel: 'Name of the node pool in your cluster.',
  },
  nodeCount: {
    label: 'Node Count',
    subLabel: 'Number of node pools.',
  },
  cbConName: {
    label: 'Cloudbuild Connection Name',
    subLabel: 'Name of the connection to be used.',
  },
  cbRepName: {
    label: 'Cloudbuild Repository Name',
    subLabel: 'Name of the repository for your project.',
  },
  cbTrgName: {
    label: 'Cloubdbuild Trigger Name',
    subLabel: 'Name of the trigger for the build process.',
  },
  branchName: {
    label: 'Branch Name',
    subLabel: 'Name of the branch in your repository.',
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
    ghURL: '',
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

  const createProject = async (info:object):Promise<void>=>{
    const formData = new FormData();
    for(const [key,value] of Object.entries(info)) formData.append(key,value)
    formData.forEach((value, key) => console.log(`${key}:`, value));
    const response = await fetch('/create-project',{
      method:'POST',
      body: formData
    }).then(data=>data.json()).then(data=>data.id);
    
    const deploy = await fetch(`/deploy/${response}`,{
      method:'POST'
    })
    console.log(deploy);
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formPayload = {
      ...formDatas,
      file: selectedFile,
    };

    console.log('Form submitted:', formPayload);
    createProject(formPayload);
    // Perform further actions such as sending the data to a backend
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6'
    >
      <h1 className='text-2xl font-bold mb-4 text-gray-800'>Deployment Form</h1>

      {Object.keys(formDatas).map((key) => (
        <div key={key} className='flex flex-col'>
          <label
            htmlFor={key}
            className='text-lg font-semibold mb-2 capitalize text-gray-700'
          >
            {fieldDetails[key]?.label ||
              key.replace(/([A-Z])/g, ' $1').toUpperCase()}
          </label>
          {fieldDetails[key]?.subLabel && (
            <p className='text-sm text-gray-500 mb-2'>
              {fieldDetails[key].subLabel}
            </p>
          )}
          <input
            type='text'
            id={key}
            name={key}
            value={formDatas[key as keyof typeof formDatas]}
            onChange={handleChange}
            className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
      ))}

      {/* File Upload Input */}
      <div className='flex flex-col'>
        <label
          htmlFor='fileUpload'
          className='text-lg font-semibold mb-2 capitalize text-gray-700'
        >
          Upload File
        </label>
        <p className='text-sm text-gray-500 mb-2'>Choose a file to upload.</p>
        <input
          type='file'
          id='fileUpload'
          name='fileUpload'
          onChange={handleFileChange}
          className='p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      <button
        type='submit'
        className='w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        Submit
      </button>
    </form>
  );
};

export default Deployments;
