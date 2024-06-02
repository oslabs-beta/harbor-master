import App from './components/App';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/style.css';
const container = document.getElementById('app-root');
const root = createRoot(container);
root.render(React.createElement(App, null));
//# sourceMappingURL=index.js.map