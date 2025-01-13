import React,{useEffect,useState} from 'react';
import { useAppDispatch,useAppSelector } from './hooks';
import ProjectCard from './ProjectCard';
import Vertex from 'interfaces/Vertex';
import Edge from 'interfaces/Edge';
import ServiceAccountCredentials from 'interfaces/ServiceAccountCredentials';
import { useLocation } from 'react-router-dom';


interface Project{
  _id: string,
  appInstallationId: String,
  gcpProjectId: string,
  gcpProjectNumber: number,
  gcpServiceAcctEmail: String,
  gcpRegion: String,
  gcpComputeZone: String,
  gcpServiceAccounts: Array<ServiceAccountCredentials>,
  deploymentOptions: Object,
  terraformState: Object,
  githubToken: String,
  githubUrl: string,
  createdAt: String,
  vertices: Array<Vertex>,
  edges: Array<Edge>,
  isDeployed: Boolean
};

const Account: React.FC = () => {
  const location = useLocation();
  const [projects,setProjects] = useState<Project[]>([]);
  let user = useAppSelector((state)=>state.user);
  useEffect(() => {
    console.log(user);
    const fetchProjects = async () => {
      if (user.projects) {
        // Use a functional update to ensure you're not mutating the state directly
        const newProjects = await Promise.all(
          user.projects.map(async (id) => {
            const response = await fetch(`/api/projects/get-project/${id}`);
            if(response.status===200){
              const proj = await response.json();
              console.log(proj);
              return proj;
            }
          })
        );
        setProjects(newProjects);
      }
    };

    fetchProjects();
  }, [user.projects,location.pathname]);
  console.log(projects,'projects');
  return (
    <div className="p-6 min-h-screen">
      <div className="bg-dark-gray p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-blue-text">Welcome, {user?.githubHandle}</h1>
        <p className="mt-2 text-sub-text">The current email address for this account is <span className="font-medium">{user?.email}</span></p>
      </div>
      
      <div className="p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-text mb-4">Deployments</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.length !== 0 ? (
          projects.map((project) => (
            <ProjectCard 
              key={project.gcpProjectId} 
              projDBId={project._id}
              projectId={project.gcpProjectId} 
              projectNumber={project.gcpProjectNumber} 
              githubUrl={project.githubUrl}
            />
          ))) : (<p className='text-sub-text'>No applications currently deployed</p>)}
        </div>
      </div>
    </div>
  );
};

export default Account;
