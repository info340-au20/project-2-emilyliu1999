import React from 'react';
import ReactDOM from 'react-dom';
import './css/style.css';
import App from './App.js';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

let tasks = [
  {id: 1, name: "go to farmer's market & go on a picnic", complete: false},
  {id: 2, name: "buy some pens from muji", complete: false},
  {id: 3, name: "decorate room", complete: false}
];

let completed = [];

// let tasks = [
//   {name: "go to farmer's market & go on a picnic"},
//   {name: "buy some pens from muji"},
//   {name: "decorate room"}
// ];

ReactDOM.render(
  <React.StrictMode>
    <App tasks={tasks} completed={completed}/>
  </React.StrictMode>,
  document.getElementById('root')
);
