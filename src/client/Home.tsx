import React from 'react';

const Home: React.FC = () => {
  return (
    <section className='bg-white '>
      <div className='container flex flex-col items-center px-4 py-12 mx-auto text-center'>
        <h2 className='text-2xl font-bold tracking-tight text-gray-800 xl:text-3xl'>
          Struggling with deployments? Let Harbor Master guide your way!
        </h2>

        <p className='block max-w-4xl mt-4 text-gray-500 '>
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

        <div className='mt-6'>
          <a
            href='#'
            className='inline-flex items-center justify-center w-full px-4 py-2.5 overflow-hidden text-sm text-white transition-colors duration-300 bg-gray-900 rounded-lg shadow sm:w-auto sm:mx-2 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 focus:ring focus:ring-gray-300 focus:ring-opacity-80'
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
                fill-rule='evenodd'
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
            href='#'
            className='inline-flex items-center justify-center w-full px-4 py-2.5 mt-4 overflow-hidden text-sm text-white transition-colors duration-300 bg-blue-600 rounded-lg shadow sm:w-auto sm:mx-2 sm:mt-0 hover:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80'
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
      </div>
    </section>
  );
};

export default Home;
