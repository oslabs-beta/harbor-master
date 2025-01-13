import React from "react";
import { useAppSelector } from "./hooks";
import { useEffect,useState } from "react";
import e from "express";
import { useAppDispatch } from "./hooks";
import { setUser,delProject } from "../common/slices/userSlice";
import ProjectModal from "./ProjectModal";
import { Link } from "react-router-dom";
import { ContinuousColorLegend } from "@mui/x-charts";
import { nextTick } from "process";
import { use } from "passport";
interface ProjectCardProps {
  key:string
  projectId:String
  projectNumber:number
  githubUrl:string
  projDBId:string
}

const ProjectCard:React.FC<ProjectCardProps> = ({ projectId, projectNumber, githubUrl,projDBId}) => {
    const [endpoint,setEndpoint] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [deleted,setDeleted] = useState<boolean>(false);
    const [endpointFetched,setEndpointFetched] = useState<boolean>(false);
    const [loadingDots, setLoadingDots] = useState<string>('');

    console.log(endpointFetched,'endpoint fetched');

    const dispatch = useAppDispatch();
    const parts = githubUrl.split('/');
    const repoName = parts[parts.length-1].replace('.git', '');

    if(localStorage.getItem(`loaded-${projDBId}`)!=='true') localStorage.setItem(`loaded-${projDBId}`,'false');

    useEffect(()=>{
      console.log('loading in ProjectCard:',loading)
      const getEndpoint = async () => {
        setLoadingDots(''); // Reset loading dots
    
        // Start interval to update loading dots
        const interval = setInterval(() => {
          setLoadingDots((prev) => (prev.length < 3 ? prev + '.' : ''));
        }, 250);
    
        try {
          const endpointResponse = await fetch(`/api/projects/getEndpoint/${projDBId}`).then(data=>data.json()).then(data=>data.endpoint);
    
          console.log('endpoint:', endpointResponse);
          localStorage.setItem(`endpoint-${projDBId}`, endpointResponse);
          localStorage.setItem(`loaded-${projDBId}`, 'true');
          setEndpoint(endpointResponse);
        } catch (error) {
          console.error('Error fetching endpoint:', error);
        } finally {
          setEndpointFetched(true);
          clearInterval(interval); // Clear the interval once done
        }
      };

      if(localStorage.getItem(`loaded-${projDBId}`)==='true'){
        setEndpointFetched(true);
        setEndpoint(localStorage.getItem(`endpoint-${projDBId}`)!);
      }
      if(localStorage.getItem(`loaded-${projDBId}`)==='false' || !localStorage.getItem(`loaded-${projDBId}`) && deleted!== false) getEndpoint();

    },[projDBId,location,deleted,loading]);

    const deleteProject = async () => {
      console.log(loading);

      console.log('deleting',`loaded-${projDBId}`);
      console.log('deleting',`endpoint-${projDBId}`)

      localStorage.removeItem(`loaded-${projDBId}`);
      localStorage.removeItem(`endpoint-${projDBId}`);

      const response = await fetch(`api/projects/delete-project/${projDBId}`);
      dispatch(delProject(projDBId));
      console.log(await response);

      if(response.status===200){
        setLoading(false);
        setDeleted(true);
        setEndpointFetched(true);
        localStorage.removeItem(`loaded-${projDBId}`);
        return;
      }else{
        return alert('Error deleting project, please try again');
      }
    }
    
    const handleCancel = () => {
      setLoading(false);
    };

    return (
      !deleted && (
        <div className="p-6 bg-input-bg border-custom-blue border-2 mx-auto rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-text">Github Repo: {repoName}</h3>
          <p className="text-sub-text mb-4">Project Number: {projectNumber}</p>
          <p className="text-sub-text mb-4">Project ID: {projectId}</p>
          <div className="flex flex-col space-y-3 justify-between items-center">
            
            {/* GitHub Repository Link */}
            <a 
              href={githubUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full px-4 py-2 bg-custom-blue rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 no-underline text-sub-text focus:ring-blue-500 transition duration-200 ease-in-out text-center"
            >
              GitHub Repository
            </a>
    
            {/* Your Application Link */}
            {!endpointFetched ? (
                <span className=" w-full px-4 py-2 bg-custom-blue rounded-lg text-sub-text text-center">Fetching endpoint{loadingDots}</span>
              ) : (
              <a
                href={`http://${endpoint}:3000`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-4 py-2 bg-custom-blue rounded-lg hover:bg-blue-700 focus:outline-none no-underline text-sub-text focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out text-center"
              >
                Your Application
              </a>
            )}
    
            {/* Check Metrics Link */}
            <Link 
              to='/metrics' 
              className='w-full px-4 py-2 bg-custom-blue rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 no-underline text-sub-text focus:ring-blue-500 transition duration-200 ease-in-out text-center'
              state={{ project: projDBId }}
            >
              Check Metrics
            </Link>
    
            {/* Delete Button */}
            <button
              type="button"
              className="w-full px-4 py-2 bg-custom-blue text-sub-text rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
              disabled={loading} // Disable when loading
              onClick={() => { setLoading(true) }}
            >
              {!loading ? 'Delete' : 'Deleting...'}
            </button>
            {loading && (
                <ProjectModal
                  onDeleteAndContinue={deleteProject}
                  onClose={handleCancel}
                  show={loading}
                  type={'deleting'}
                />
              )}
          </div>
        </div>
      )
    );
    
};

export default ProjectCard;