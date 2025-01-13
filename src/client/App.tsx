import React,{useEffect,useState} from 'react';
import Navbar from './Navbar';
import Container from './Container';
import SideNav from './Side-nav';
import Banner from './Banner';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './Home';
import Account from './Account';
import Deployments from './Deployments';
import Metrics from './Metrics';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import ReverseProtectedRoute from './ReverseProtectedRoute';
import { useAppSelector,useAppDispatch } from './hooks';
import { setUser } from '../common/slices/userSlice';
import backgroundImage from './images/1.jpg';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null represents the loading state
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  useEffect(()=>{
    console.log('in app use effect');
    const getUsername = async () =>{
      const usernameElement = document.getElementById('username');
      const response = await (fetch('/api/users/get-user')).then(user=>user.json());
        if(response){
          if(Object.keys(response).includes('githubHandle') && Object.keys(response).includes('email')){
            console.log(response);
            dispatch(setUser(response));
            setIsAuthenticated(true);
          }else{
            setIsAuthenticated(false);
        }
      }else{
        setIsAuthenticated(false);
      }
    }
    getUsername();
  },[setUser]);
  if (isAuthenticated === null) {
    // Render a loading state while checking authentication
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-dark-gray h-screen overflow-hidden"> {/* Apply your consistent background style here */}
      <BrowserRouter>
        <Navbar />
        <div className='flex'>
          <SideNav />
          <Container>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/metrics' element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<Metrics/>} />} />
              <Route path='/deployments' element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<Deployments />} />} />
              <Route path='/account' element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<Account />} />} />
              <Route path='/login' element={<ReverseProtectedRoute element={<Login />} />} />
            </Routes>
          </Container>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;