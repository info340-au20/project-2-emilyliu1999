import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

// import LandingPage from './landing.js';
import LoginPage from './login.js';
// import SchedulePage from './schedule.js';
// import TaskPage from './index.js';

import { Route, Switch, Redirect, NavLink } from 'react-router-dom';

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

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

export function App(props) {
  // changed from decomposed instantiation to prevent ESLint
  // from getting angry about an unused variable
  const [tasks, setTasks] = useState(props.tasks);
  const [completed, setCompleted] = useState(props.completed);
  // state variables for error message and current user
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const markCompleted = (taskId) => {
    let updatedTasksArray = tasks.map((task) => {
      let taskCopy = {...task};
      if (taskCopy.id === taskId) {
        taskCopy.complete = !taskCopy.complete;
        completed.push(taskCopy);
      }
      return taskCopy;
    })

    updatedTasksArray = updatedTasksArray.filter((item) => item.id !== taskId);

    setTasks(updatedTasksArray);
    setCompleted(completed);
  }

  const undoCompletion = (taskId) => {
    let updatedCompletedArray = completed.map((task) => {
      let taskCopy = {...task};
      if (taskCopy.id === taskId) {
        taskCopy.complete = !taskCopy.complete;
        tasks.push(taskCopy);
      }
      return taskCopy;
    })

    updatedCompletedArray = updatedCompletedArray.filter((item) => item.id !== taskId);

    setTasks(tasks);
    setCompleted(updatedCompletedArray);
  }

  ////////////////////

  // use effect hook to wait until the component loads
  useEffect(() => {
    const authUnregisterHandler = firebase.auth().onAuthStateChanged((firebaseUser) => {
      if(firebaseUser) {
        console.log( firebaseUser.displayName + ", you are logged in!")
        setUser(firebaseUser);
        setIsLoading(false);
      } else {
        console.log("Logged out")
        setUser(null);
        setIsLoading(false);
      }
    });

    return function cleanup() {
      authUnregisterHandler();
    }
  }, []) // Only run hook on first load

  if (isLoading) {
    return (
      <div className="spinner">
        <i className="fa fa-spinner fa-spin fa-3x" aria-label="Loading..."></i>
      </div>
    );
  }

  let content = null; //content to render

  if(!user) { // if no user has successfully logged in, show sign in form
    content = (
      <div className="login-page">
        <h2>sign in</h2>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
    );
  } else {  // otherwise, show welcome page
    content = (
      <div className="content">
        <Header />
        <Main user={user} tasks={tasks} completed={completed} markCompleted={markCompleted} undoCompletion={undoCompletion}/>
      </div>
    );
  }
  return content;
}

export function Header() {
  return (
    <header>
      <div className="nav-bar">
        <SideBar />
      </div>
    </header>
  );
}

export function SideBar() {
  //allow user to log out
  const handleSignOut = () => {
    console.log("outtie");
    firebase.auth().signOut()
  }

  return (
    <div className="side-bar">
      <div className="menu">
        <ul>
          <li><a href="#"><i className="fa fa-bars" aria-label="menu"></i></a></li>
          <li><NavLink exact to="/" activeClassName="activeLink"><i className="fas fa-home"></i>home</NavLink></li>
          <li><a href="#"><i className="fas fa-inbox"></i>inbox</a></li>
          <li><a href="#"><i className="far fa-check-circle"></i>my tasks</a></li>
          <li><a href="#"><i className="far fa-calendar-alt"></i>schedule</a></li>
          <li onClick={handleSignOut}><a href="#"><i className="fas fa-lock"></i>log out</a></li>
        </ul>

      </div>
      <div className="social-media">
        <li><a href="#"><i className="fab fa-facebook-f" aria-hidden="true"></i></a></li>
        <li><a href="#"><i className="fab fa-instagram" aria-hidden="true"></i></a></li>
        <li><a href="#"><i className="fab fa-twitter" aria-hidden="true"></i></a></li>
      </div>
    </div>
  );
}

/* <Route path="/tasks" component={TaskPage} />
<Route path="/schedule" component={SchedulePage} /> */

// React component handling routing to the proper pages
export function Main(props) {
  return (
    <section>
      <div className="top-bar">
        <h1>flora & fauna</h1>
        <Switch>
          <Route exact path="/" render={(routerProps) => (
            <HomePage {...routerProps}/>
          )}/>
          <Redirect to="/" />
        </Switch>
      </div>
    </section>
  );
}

export function HomePage(props) {
  return (
    <div className="content">
      <p><em>growth happens little by little, day by day.</em></p>
      <div className="key">
        <li><i className="fas fa-seedling"></i> = in progress</li>
        <li><i className="fab fa-pagelines"></i> = complete</li>
      </div>

      <TaskBox tasks={props.tasks} completed={props.completed} markCompleted={props.markCompleted} undoCompletion={props.undoCompletion}/>
    </div>
  );
}

export function AddTaskButton(props) {
  return (
    <div className="key">
      <li>Add New Task</li>
    </div>
  );
}

export function TaskBox(props) {
  return (
    <div className="container">
        <div className="row">
            <div className="col d-flex">
                <TaskCard tasks={props.tasks} markCompleted={props.markCompleted} undoCompletion={props.undoCompletion}/>
            </div>
            <div className="col d-flex">
                <TaskCard tasks={props.completed} markCompleted={props.markCompleted} undoCompletion={props.undoCompletion}/>
            </div>
        </div>
    </div>
  );
}

export function TaskCard(props) {

  let title;
  if (props.tasks && props.tasks.length > 0) {
    title = "current";
  } else {
    title = "completed";
  }

  return (
    <div className="card mb-4">
      <div className="card-header" role="navigation">
          <h2 className="mb-4">My Tasks</h2>
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
            <a className="nav-link active" href="#">{title}</a>
            </li>
            {/* <li className="nav-item">
              <a className="nav-link disabled" href="#">Upcoming</a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="#">Completed</a>
            </li> */}
          </ul>
      </div>

      <div className="card-body">
          <div className="row">
              <div className="col-sm">
                  <TaskList
                    tasks={props.tasks}
                    markCompleted={props.markCompleted}
                    undoCompletion={props.undoCompletion}
                  />
              </div>
          </div>
      </div>
    </div>
  );
}

export function TaskList(props) {
  let taskItems;
  if (props.tasks !== undefined) {
    taskItems = props.tasks.map(task =>
      <TaskItem
          id={task.id}
          name={task.name}
          key={task.name}
          complete={task.complete}
          markCompleted={props.markCompleted}
          undoCompletion={props.undoCompletion}
      />
    );
  } else {
    taskItems = undefined;
  }

  return (
      <ul className="list-group list-group-flush">
        {taskItems}
      </ul>
  );
}

export function TaskItem(props) {
  let taskName = props.name;

  // set up initial state
  let icon;
  if (!props.complete) {
      icon = <i className="fas fa-seedling"></i>
  } else {
      icon = <i className="fab fa-pagelines"></i>
  }

  const handleClick = (event) => {
      if (!props.complete) {
        props.markCompleted(props.id)
      } else {
        props.undoCompletion(props.id);
      }
  }

  return (
      <li className="list-group-item" onClick={handleClick}>
      <a href="#"></a>
      {icon}
      {taskName}
      </li>
  );
}

export default App;
