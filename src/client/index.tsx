import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import ChartsOverviewDemo from './ChartsOverviewDemo'



ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      
      <ChartsOverviewDemo/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('app')
);
