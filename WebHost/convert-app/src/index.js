import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/app';

if (process.env.NODE_ENV !== 'production') {
  console.log('process.env', process.env);
}

ReactDOM.render(<App />, document.getElementById('root'));
