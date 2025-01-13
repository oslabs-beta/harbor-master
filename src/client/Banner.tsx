import React from 'react';

const Banner: React.FC = () => {
  return (
    <section className='bg-white dark:bg-gray-900'>
      <div className='container flex flex-col items-center px-4 py-12 mx-auto text-center'>
        <h2 className='max-w-2xl mx-auto text-2xl font-semibold tracking-tight text-gray-800 xl:text-3xl dark:text-white'>
          Deployment made <span className='text-blue-500'>easier</span>
        </h2>

        <p className='max-w-4xl mt-6 text-center text-gray-500 dark:text-gray-300'>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cum quidem
          officiis reprehenderit, aperiam veritatis non, quod veniam fuga
          possimus hic explicabo laboriosam nam. A tempore totam ipsa nemo
          adipisci iusto!
        </p>

        <div className='inline-flex w-full mt-6 sm:w-auto'>
          <a
            href='#'
            className='inline-flex items-center justify-center w-full px-6 py-2 text-white duration-300 bg-custom-blue rounded-lg hover:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80'
          >
            Sign Up
          </a>
        </div>
      </div>
    </section>
  );
};

export default Banner;
