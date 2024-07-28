import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { App }  from './App';
import Metrics from './Metrics';
import { CpuUsage } from './CpuUsage';
import { MemoryUsage } from './MemoryUsage';


ReactDOM.render(
  // <React.StrictMode>
    <>
    <Provider store={store}>
      <Metrics />
    </Provider>
  {/* </React.StrictMode> */}
  </>,
  document.getElementById('app')
);
