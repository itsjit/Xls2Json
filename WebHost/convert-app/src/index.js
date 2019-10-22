import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/app';
import './i18n';

if (process.env.NODE_ENV !== 'production') {
  console.log('process.env', process.env);
}

ReactDOM.render(
  <Suspense fallback="loading">
    <App />
  </Suspense>,
  document.getElementById('root')
);
