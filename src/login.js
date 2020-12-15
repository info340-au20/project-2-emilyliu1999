import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

/* const loginForm = document.getElementById('login-form');
const loginButton = document.getElementById('login-button');
const loginErrorMsg = document.getElementId('login-error-msg');

loginButton.addEventListener("click", (submit) => {
    submit.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    if (username == "user" && password == "web_dev") {
        location.reload();
    } else {
        loginErrorMsg.style.opacity = 1;
    }

})

// Function for creating a new Firebase acount
function createAccount(email, password) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredentials) => {
      let user = userCredentials.user; // access the newly created user
      console.log('User created: '+user.uid);
  })
  .catch((error) => { // report any errors
      console.log(error.message);
  });
} */

// React component for the Login page
export function LoginPage(props) {

  // FirebaseUI config
  const uiConfig = {
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: true
      },
      firebase.auth.GoogleAuthProvider.PROVIDER_ID, // Google login
    ],
    //page won't show account chooser
    credentialHelper: 'none',
    //use popup instead of redirect for external sign-up methods -- Google
    signInFlow: 'popup',
    callbacks: {
      //Avoid redirects after sign-in
      signInSuccessWithAuthResult: () => false,
    },
  };

  // state variables for error message and current user
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // use effect hook to wait until the component loads
  useEffect(() => {
    const authUnregisterHandler = firebase.auth().onAuthStateChanged((firebaseUser) => {
      if(firebaseUser) {
        console.log( firebaseUser.displayName + ", you are logged in!")
        setUser(firebaseUser)
        setIsLoading(false);
      } else {
        console.log("Logged out")
        setUser(null)
        setIsLoading(false);
      }
    });

    return function cleanup() {
      authUnregisterHandler();
    }
  }, []) // Only run hook on first load

  //allow user to log out
  const handleSignOut = () => {
    setErrorMessage(null);
    firebase.auth().signOut()
  }

  if (isLoading) {
    return (
      <div className="spinner">
        <i className="fa fa-spinner fa-spin fa-3x" aria-label="Loading..."></i>
      </div>
    );
  }

  let content = null; //content to render

  if(!user) { //if no user is successfully logged in, show signup form
    content = (
      <div className="login-page">
        <h2>sign in</h2>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
    );
  } else {  // otherwise, show welcome page
    content = (
      <div>
        <p> welcome, {user.displayName}!</p>
        <button className="btn btn-warning" onClick={handleSignOut}>
          Log Out
        </button>
      </div>
    )
  }
  return content;
}

export default LoginPage;
