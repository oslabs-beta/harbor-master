import React from 'react';
import { Link,useLocation } from 'react-router-dom';
import { useEffect,useState } from 'react';
import {store} from './store';
import userSlice, {setUser} from '../common/slices/userSlice'
import { useAppDispatch,useAppSelector } from './hooks';
const SideNav: React.FC = () => {
  const user = useAppSelector((state) => state.user);
  const location = useLocation();
  const [selected, setSelected] = useState<string>(location.pathname);

  useEffect(() => {
    // Update the selected state based on the current URL
    setSelected(location.pathname);

    const usernameDiv = document.getElementById('username');
    if (usernameDiv) {
      if (user.githubHandle !== null) {
        usernameDiv.innerText = user.githubHandle;
      }
    }
  }, [location.pathname, user]);
  return (
    <div className='flex h-screen w-16 flex-col justify-between bg-custom-blue'>
      <div className='flex flex-col items-center'>
        {/* Username Circle */}
        <div className='inline-flex items-center justify-center mt-4'>
          <div
            id="username"
            className='flex items-center justify-center rounded-full text-xs w-12 h-12 text-center bg-white text-gray-600 border border-gray-300'
          >
            Guest<span className='text-xs'>{}</span>
          </div>
        </div>
  
        {/* Navigation Links */}
        <div className='mt-4 flex flex-col items-center space-y-4'>
          <Link
            to='/'
            className={`group relative flex items-center justify-center w-full p-3 rounded-lg ${selected === '/' ? 'bg-white text-custom-blue' : 'text-gray-50 hover:bg-white hover:text-custom-blue'}`}
            onClick={() => setSelected('/')}
          >
            <i className='bi bi-house' style={{ fontSize: '20px' }}></i>
            <span className='invisible absolute left-full top-1/2 transform -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible'>
              Home
            </span>
          </Link>
  
          <Link
            to='/deployments'
            className={`group relative flex items-center justify-center w-full p-3 rounded-lg ${selected === '/deployments' ? 'bg-white text-custom-blue' : 'text-gray-50 hover:bg-white hover:text-custom-blue'}`}
            onClick={() => setSelected('/deployments')}
          >
            <i className='bi bi-window-plus' style={{ fontSize: '20px' }}></i>
            <span className='invisible absolute left-full top-1/2 transform -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible'>
              Deployments
            </span>
          </Link>
  
          <Link
            to='/account'
            className={`group relative flex items-center justify-center w-full p-3 rounded-lg ${selected === '/account' ? 'bg-white text-custom-blue' : 'text-gray-50 hover:bg-white hover:text-custom-blue'}`}
            onClick={() => setSelected('/account')}
          >
            <i className='bi bi-person' style={{ fontSize: '20px' }}></i>
            <span className='invisible absolute left-full top-1/2 transform -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible'>
              Account
            </span>
          </Link>
        </div>
      </div>
  
      {/* Logout Button */}
      <div className='sticky inset-x-0 bottom-0 border-gray-100 bg-custom-blue p-2'>
        <form action='#'>
          <button
            type='submit'
            className='group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-50 hover:bg-gray-50 hover:text-custom-blue'
          >
            <i className='bi bi-box-arrow-right' style={{ fontSize: '20px' }}></i>
            <span className='invisible absolute left-full top-1/2 transform -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-gray-50 hover:text-custom-blue group-hover:visible'>
              Logout
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SideNav;
