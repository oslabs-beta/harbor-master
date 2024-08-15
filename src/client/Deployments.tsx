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
    subLabel: 'Region where your resources are located.',
  },
  compZ: {
    label: 'Compute Zone',
    subLabel: 'Specific zone within the compute region.',
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
    label: 'Container Name',
    subLabel: 'Name of the container to be used.',
  },
  arName: {
    label: 'Artifact Name',
    subLabel: 'Name of the artifact to be managed Example hb/test',
  },
  npName: {
    label: 'Node Pool Name',
    subLabel: 'Name of the node pool in your cluster.',
  },
  nodeCount: {
    label: 'Node Count',
    subLabel: 'Number of nodes in the node pool.',
  },
  cbConName: {
    label: 'Connection Name',
    subLabel: 'Name of the connection to be used.',
  },
  cbRepName: {
    label: 'Repository Name',
    subLabel: 'Name of the repository for your project.',
  },
  cTrgName: {
    label: 'Trigger Name',
    subLabel: 'Name of the trigger for the build process.',
  },
  branchName: {
    label: 'Branch Name',
    subLabel: 'Name of the branch in your repository.',
  },
};

const Deployments: React.FC = () => {
  const initialData = {
    appId: '51725755',
    projId: 'hmlivetest',
    projNum: '276680725178',
    saMail: 'terraform@hmlivetest.iam.gserviceaccount.com',
    compR: 'us-central1',
    compZ: 'us-central1-a',
    ghTok: 'ghp_Txxxxxxxxxxxxxxxxf',
    ghURL: 'https://github.com/Crossur/Solo-Project.git',
    cName: 'primary',
    arName: 'hb/test',
    npName: 'test-node-pool',
    nodeCount: '1',
    cbConName: 'test-connection',
    cbRepName: 'test-repo',
    cTrgName: 'test-trigger',
    branchName: 'main',
  };

  const [formData, setFormData] = useState(initialData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formPayload = {
      ...formData,
      file: selectedFile,
    };

    console.log('Form submitted:', formPayload);

    // Perform further actions such as sending the data to a backend
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6'
    >
      <h1 className='text-2xl font-bold mb-4 text-gray-800'>Deployment Form</h1>

      {Object.keys(formData).map((key) => (
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
            value={formData[key as keyof typeof formData]}
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
