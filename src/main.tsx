import React from 'react';
import ReactDOM from 'react-dom/client';
import App, { AppVm } from './App';

const rootElement = document.getElementById('root');
const appVm = new AppVm()

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<React.StrictMode><App vm={appVm} /></React.StrictMode>);
}