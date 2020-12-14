import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'css/style.css'; //import css file!

const loginForm = document.getElementById('login-form');
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

/* 
//FirebaseUI config
const uiConfig = {
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: true
    },
    firebase.auth.GoogleAuthProvider.PROVIDER_ID //Google login
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

function App(props) {
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((firebaseUser) => {
      if(firebaseUser) {
        console.log( firebaseUser.displayName + ", you are logged in!")
        setUser(firebaseUser)
      } else {
        console.log("see you later!")
        setUser(null)
      }
    })
  })

  //allow user to log out
  const handleSignOut = () => {
    setErrorMessage(null);
    firebase.auth().signOut()
  }

  let content = null; //content to render

  if(!user) { //if logged out, show signup form
    content = (
      <div className="login-page">
        <h1>Welcome Back</h1>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
    );
  } else {
    content = (
      <div>
        <WelcomeHeader user={user}>
          {user &&
            <button className="btn btn-warning" onClick={handleSignOut}>
              Log Out {user.displayName}
            </button>
          }
        </WelcomeHeader>
      </div>
    )
  }
} 
*/


