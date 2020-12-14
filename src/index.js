import React from 'react';
import ReactDOM from 'react-dom';
import './css/style.css';
import App from './App.js';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYTipq7O1wJm8bc4RxxfdiMkr3iuI_Wrw",
  authDomain: "flora-fauna-74097.firebaseapp.com",
  databaseURL: "https://flora-fauna-74097-default-rtdb.firebaseio.com",
  projectId: "flora-fauna-74097",
  storageBucket: "flora-fauna-74097.appspot.com",
  messagingSenderId: "958808924564",
  appId: "1:958808924564:web:d38870d3dc56cf8b4b6f81",
  measurementId: "G-CEJXREG6P6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let tasks = [
  {id: 1, name: "go to farmer's market & go on a picnic", complete: false},
  {id: 2, name: "buy some pens from muji", complete: false},
  {id: 3, name: "decorate room", complete: false}
];

let completed = [];

ReactDOM.render(
  <React.StrictMode>
    <App tasks={tasks} completed={completed}/>
  </React.StrictMode>,
  document.getElementById('root')
);


export default index;