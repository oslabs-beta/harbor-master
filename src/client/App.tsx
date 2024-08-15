import React from 'react';
import Navbar from './Navbar';
import Container from './Container';
import SideNav from './Side-nav';
import Banner from './Banner';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Account from './Account';
import Deployments from './Deployments';
import Metrics from './Metrics';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <>
        <Navbar />
        {/* <Banner /> */}
        <div className='flex'>
          <SideNav />
          <Container>
            <Routes>
              <Route path='/' element={<Home />}></Route>
              <Route path='/metrics' element={<Metrics />}></Route>
              <Route path='/deployments' element={<Deployments />}></Route>{' '}
              <Route path='/account' element={<Account />}></Route>
            </Routes>
          </Container>
        </div>
      </>
    </BrowserRouter>
  );
};

export function App() {
  return (
    <Chart
      chartType="Line"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  );
}
