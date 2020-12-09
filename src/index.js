import React from 'react';
import ReactDOM from 'react-dom';
import './css/style.css';
import App from './App.js';

let tasks = [
  {name: "go to farmer's market & go on a picnic"},
  {name: "buy some pens from muji"},
  {name: "decorate room"}
];

ReactDOM.render(
  <React.StrictMode>
    <App tasks={tasks}/>
  </React.StrictMode>,
  document.getElementById('root')
);
