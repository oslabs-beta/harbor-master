import { ContinuousColorLegend } from '@mui/x-charts';
import React, { useEffect,useState } from 'react';
import copySAE from './gifs/cSAE.gif';
import creatingSAKey from './gifs/creating SA key.gif';
import getAppId from './gifs/getting app installation id.gif';
import navToIAM from './gifs/navigating to IAM.gif';
import showCreateProj from './gifs/showing create project.gif';
import showDeployPage from './gifs/showing deployments page.gif';
import showCreateSA from './gifs/showing create service account.gif';
import showGetProj from './gifs/showing get project details.gif';
import showGetGH from './gifs/showing github token.gif';
import { useAppSelector } from './hooks';

const Home: React.FC = () => {
  const [loggedIn,setLoggedIn] = useState<boolean>(false);
  const user = useAppSelector(state=>state.user);
  useEffect(()=>{
    if(user._id!==null) setLoggedIn(true);
  },[])
  if(loggedIn){
    return (
      <section className="bg-dark-gray">
        <div className="container flex flex-col items-center px-4 py-12 mx-auto text-center h-[calc(100vh-4rem)] overflow-y-auto pb-8 scrollbar-hide">
          <h2 className="text-2xl font-bold tracking-tight text-blue-text xl:text-3xl">
            Struggling with deployments? Let Harbor Master guide your way!
          </h2>
    
            <p className="block max-w-4xl text-sub-text">
              Harbor Master is a user-friendly tool that simplifies infrastructure
              management using Docker, Kubernetes, and Terraform. It enables easy
              application deployment without requiring deep DevOps knowledge. By
              leveraging Terraform, Harbor Master ensures consistent and scalable
              infrastructure through a .tf file. Getting started is simple: just
              provide a GitHub repository with your Dockerfile, and follow a
              step-by-step guide to set up Google Cloud Platform. Harbor Master
              automates deployment with a CI/CD pipeline and provides real-time
              resource analytics, making it a complete solution for managing
              infrastructure efficiently.
            </p>

         <div className="block max-w-4xl text-sub-text text-center text-lg">
         <p className='text-2xl font-bold tracking-tight text-blue-text xl:text-3xl'>Prerequisites</p>
         To get started with Harbor Master, first create a Dockerfile in your GitHub repository to manage the downloading of your application's dependencies. After setting up the 
         Dockerfile, follow the tutorial below to gather the necessary information for deployment. (Please note that the appearance of the website in the tutorial may differ from 
         the current version as we continue to update and enhance our site.)
         <div className='text-2xl font-bold mt-2 mb-2 tracking-tight text-blue-text xl:text-3xl'>Tutorial</div>
          The first step is to add Google Cloud Build with your GitHub 
         account and save the app installation ID, as demonstrated below.
            {/* Centered GIF */}
            <div className="flex justify-center my-4">
              <img src={copySAE} alt="Google Cloud Build Setup" className="max-w-full" />
            </div>
    
            You will also need to generate a GitHub access token so that Harbor Master can create the CI/CD pipeline for you. Navigate to
            the token page and make sure the token has no expiration and the privileges workflow and read:user.
            {/* Centered GIF */}
            <div className="flex justify-center my-4">
              <img src={showGetGH} alt="GitHub Access Token" className="max-w-full" />
            </div>
    
            If it is your first time navigating to the Google Cloud Console website
            your screen should look similar to the one below. Once you are here you can continue with the second step of making a project. Once it is named and created, go ahead and
            select your project so it appears in the top left.
            {/* Centered GIF */}
            <div className="flex justify-center my-4">
              <img src={showCreateProj} alt="Google Cloud Project Creation" className="max-w-full" />
            </div>
    
            With your project in the top left of your screen, you are now going to navigate to the dashboard where we will get some
            information for our project that we will save for later. After saving that information, head over to the service accounts page where we can begin our third step.
            {/* Centered GIF */}
            <div className="flex justify-center my-4">
              <img src={navToIAM} alt="Navigate to IAM" className="max-w-full" />
            </div>
    
            Once at the service accounts page, you are now going to create a service account and name it. Once named, click "create and continue." This is where you are going to give it 
            all the roles we have listed below:
            {/* Nicely styled roles */}
            <div className="grid grid-cols-2 gap-4 mt-6 text-left text-center">
            <div className="font-medium">Artifact Registry Administrator</div>
            <div className="font-medium">Secret Manager Admin</div>
            <div className="font-medium">Artifact Registry Reader</div>
            <div className="font-medium">Secret Manager Secret Accessor</div>
            <div className="font-medium">Artifact Registry Writer</div>
            <div className="font-medium">Service Account Admin</div>
            <div className="font-medium">Cloud Build Connection Admin</div>
            <div className="font-medium">Service Account Token Creator</div>
            <div className="font-medium">Cloud Build Editor</div>
            <div className="font-medium">Service Account User</div>
            <div className="font-medium">Cloud Quotas Admin</div>
            <div className="font-medium">Service Usage Admin</div>
            <div className="font-medium">Compute Admin</div>
            <div className="font-medium">Service Usage Consumer</div>
            <div className="font-medium">Instance Group Manager Service Agent</div>
            <div className="font-medium">Kubernetes Engine Admin</div>
            <div className="font-medium">Kubernetes Engine Developer</div>
            <div className="font-medium">Logs Writer</div>
          </div>
          <br></br>
    
            After accomplishing that, click "continue" and then "done."
            {/* Centered GIF */}
            <div className="flex justify-center my-4">
              <img src={showCreateSA} alt="Service Account Creation" className="max-w-full" />
            </div>
    
            Now that you are back at the main service accounts page, you can generate the most important piece of information in this whole process: the service account key. Follow the
            video below to see how. Once you click "create", Google will automatically download the .json file to your computer. With that, you are now completely done on the Google 
            Cloud Console. You can now navigate to our website where we will use all of the information you have saved in order to deploy your application! Once you have navigated to 
            our website, you need to log in with your GitHub account. Once there, navigate to the deployments tab on the left side of your screen. From here, all you need to do is fill out 
            the forms with the information we have collected as well as some other information you can choose. Once you click submit, you're done! Just wait about ten minutes, and 
            your application will be fully deployed with a CI/CD pipeline.
            {/* Centered GIF */}
            <div className="flex justify-center my-4">
              <img src={showDeployPage} alt="Deployment Page" className="max-w-full" />
            </div>
          </div>
        </div>
      </section>
    );
  }else{
    return(<section className="bg-dark-gray">
      <div className="container flex flex-col items-center px-4 py-12 mx-auto text-center h-[calc(100vh-12rem)] overflow-y-auto pb-8 scrollbar-hide">
        <h2 className="text-2xl font-bold tracking-tight text-blue-text xl:text-3xl">
          Struggling with deployments? Let Harbor Master guide your way!
        </h2>
  
          <p className="block max-w-4xl mt-4 text-sub-text">
            Harbor Master is a user-friendly tool that simplifies infrastructure
            management using Docker, Kubernetes, and Terraform. It enables easy
            application deployment without requiring deep DevOps knowledge. By
            leveraging Terraform, Harbor Master ensures consistent and scalable
            infrastructure through a .tf file. Getting started is simple: just
            provide a GitHub repository with your Dockerfile, and follow a
            step-by-step guide to set up Google Cloud Platform. Harbor Master
            automates deployment with a CI/CD pipeline and provides real-time
            resource analytics, making it a complete solution for managing
            infrastructure efficiently.
          </p>
          <br></br>
          <br></br>
          <a
    href='#'
    className='inline-flex no-underline items-center justify-center w-full px-4 py-2.5 overflow-hidden text-md text-white transition-colors duration-300 bg-gray-900 rounded-lg shadow sm:w-auto sm:mx-2 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 focus:ring focus:ring-gray-300 focus:ring-opacity-80 mb-4'
  >
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      fill='currentColor'
      className='bi bi-person-circle'
      viewBox='0 0 16 16'
    >
      <path d='M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0' />
      <path
        fillRule='evenodd'
        d='M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1'
      />
      <g>
        <g>
          <path d='M407,0H105C47.103,0,0,47.103,0,105v302c0,57.897,47.103,105,105,105h302c57.897,0,105-47.103,105-105V105C512,47.103,464.897,0,407,0z M482,407c0,41.355-33.645,75-75,75H105c-41.355,0-75-33.645-75-75V105c0-41.355,33.645-75,75-75h302c41.355,0,75,33.645,75,75V407z'></path>
        </g>
      </g>
      <g>
        <g>
          <path d='M305.646,123.531c-1.729-6.45-5.865-11.842-11.648-15.18c-11.936-6.892-27.256-2.789-34.15,9.151L256,124.166l-3.848-6.665c-6.893-11.937-22.212-16.042-34.15-9.151h-0.001c-11.938,6.893-16.042,22.212-9.15,34.151l18.281,31.664L159.678,291H110.5c-13.785,0-25,11.215-25,25c0,13.785,11.215,25,25,25h189.86l-28.868-50h-54.079l85.735-148.498C306.487,136.719,307.375,129.981,305.646,123.531z'></path>
        </g>
      </g>
      <g>
        <g>
          <path d='M401.5,291h-49.178l-55.907-96.834l-28.867,50l86.804,150.348c3.339,5.784,8.729,9.921,15.181,11.65c2.154,0.577,4.339,0.863,6.511,0.863c4.332,0,8.608-1.136,12.461-3.361c11.938-6.893,16.042-22.213,9.149-34.15L381.189,341H401.5c13.785,0,25-11.215,25-25C426.5,302.215,415.285,291,401.5,291z'></path>
        </g>
      </g>
      <g>
        <g>
          <path d='M119.264,361l-4.917,8.516c-6.892,11.938-2.787,27.258,9.151,34.15c3.927,2.267,8.219,3.345,12.458,3.344c8.646,0,17.067-4.484,21.693-12.495L176.999,361H119.264z'></path>
        </g>
      </g>
    </svg>

    <span className='mx-2'>Login with User Account</span>
  </a>

  <a
    href='http://35.202.126.33:3000/auth/github'
    className='inline-flex items-center justify-center no-underline w-full px-4 py-2.5 mt-4 overflow-hidden text-md text-white transition-colors duration-300 bg-custom-blue rounded-lg shadow sm:w-auto sm:mx-2 sm:mt-0 hover:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80'
  >
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='16'
      height='16'
      fill='currentColor'
      className='bi bi-github'
      viewBox='0 0 16 16'
    >
      <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8' />
    </svg>

    <span className='mx-2'>Login with GitHub Account</span>
  </a>
        </div>
      </section>
          )
  }
};

export default Home;
