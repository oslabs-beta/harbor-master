import App from './components/App';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './styles/style.css';
import { store } from './store';

const container = document.getElementById('app-root')!;
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <App></App>
  </Provider>
);