import React from 'react';
import {createRoot}from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import '../../public/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../public/style.css';

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <Provider store={store}>
      <App />
    </Provider>
);