import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

import TaskDetailsPage from './taskDetails.js';
import {SchedulePage} from './schedule.js';

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
  const [tasks, setTasks] = useState([]);
  const [completed, setCompleted] = useState([]);

  // state variables for error message and current user
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // callback for updating the state for tasks
  const handleTaskUpdate = (newTasks) => {
    setTasks(newTasks);
  };

  ////////////////////
  // use effect hook to wait until the component loads
  useEffect(() => {
    const authUnregisterHandler = firebase.auth().onAuthStateChanged((firebaseUser) => {
      if(firebaseUser) {
        console.log( firebaseUser.displayName + ', you are logged in!')
        setUser(firebaseUser);
        setIsLoading(false);
      } else {
        console.log('Logged out')
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
      <div className='spinner'>
        <i className='fa fa-spinner fa-spin fa-3x' aria-label='Loading...'></i>
      </div>
    );
  }

  let content = null; //content to render

  if(!user) { // if no user has successfully logged in, show landing/login page
    content = (
      <div>
        <div class='landing'>
            <h1>flora & fauna</h1>
        </div>

        <section id='landing'>
          <h1>let's get stuff done together.</h1>
          <i class='fab fa-pagelines' aria-label='leaf'></i>
          <i class='fab fa-pagelines' aria-label='leaf'></i>
          <i class='fab fa-pagelines' aria-label='leaf'></i>
          <p>
              flora & fauna is more than just a productivity tool– we're a way of life.
              We're here to keep you on track as you bloom towards your lofiest goals, every step of the way.
          </p>

          <div class='login-page'>
            <h2>sign in</h2>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
          </div>
        </section>
      </div>
    );
  } else {  // otherwise, show welcome page
    content = (
      <div className='content'>
        <Header />
        <Main user={user} tasks={tasks} completed={completed} taskUpdate={handleTaskUpdate}/>
      </div>
    );
  }
  return content;
}

export function Header() {
  return (
    <header>
      <div className='nav-bar'>
        <SideBar />
      </div>
    </header>
  );
}

export function SideBar() {
  //allow user to log out
  const handleSignOut = () => {
    firebase.auth().signOut();
  }

  return (
    <div className='side-bar'>
      <div className='menu'>
        <ul>
          {/* <li><i className='fa fa-bars' aria-label='menu' onClick='show()'></i></li> */}
          <a href='javascript:void(0)' className='closebtn' onClick={ToggleNav}>X</a>
          <li><NavLink exact to='/' activeClassName='activeLink'><i className='fas fa-home' aria-label='home'></i>home</NavLink></li>
          <li><NavLink to='/schedule' activeClassName='activeLink'><i className='far fa-calendar-alt' aria-label='schedule'></i>schedule</NavLink></li>
          <li onClick={handleSignOut}><NavLink exact to='/'><i className='fas fa-lock' aria-label='lock'></i>log out</NavLink></li>
        </ul>

      </div>
      <div className='social-media'>
        <li><a href='#'><i className='fab fa-facebook-f' aria-label='facebook' aria-hidden='true'></i></a></li>
        <li><a href='#'><i className='fab fa-instagram' aria-label='instagram' aria-hidden='true'></i></a></li>
        <li><a href='#'><i className='fab fa-twitter' aria-label='twitter' aria-hidden='true'></i></a></li>
      </div>
    </div>
  );
}

// toggle hamburger menu
export function ToggleNav() {
  const Show = () => {
    const [sideBar, setSideBar] = useState(false)
    const showSideBar = () => setSideBar(!sideBar);
    
    return (
      <div>
        { sideBar ? <SideBar onClick={showSideBar} /> : null }
      </div>
    )
  }
}

// ReactDOM.render(<Search />, document.querySelector('#container'))


// React component handling routing to the proper pages
export function Main(props) {
  const user = {...props.user};
  const tasks = [...props.tasks];
  const taskRef = firebase.database().ref(user.displayName + '/tasks');

  useEffect(() => {
    let tasks = [];
    taskRef.on('value', (snapshot) => {
      const taskValue = snapshot.val();
      let objectKeyArray = Object.keys(taskValue);
      if (objectKeyArray) {
        tasks = objectKeyArray.map((key) => {
          let singleTaskObj = taskValue[key];
          singleTaskObj.key = key;
          return singleTaskObj;
        })
        props.taskUpdate(tasks);
      }
    });

    return function cleanup() {
      taskRef.off();
    }
  }, []);


  // <Route path='/schedule' component={SchedulePage} />
  return (
    <section>
      <div className='top-bar'>
        <button className='openbtn' onClick={ToggleNav}><i className='fa fa-bars' aria-label='menu'></i></button>
        <h1>flora & fauna</h1>
        <Switch>
          <Route exact path='/' render={(routerProps) => (
            <HomePage user={user} tasks={tasks} />
          )}/>
          <Route path='/task/:taskKey' render={(routerProps) => (
            <TaskDetailsPage user={user} />
          )}/>
          <Route path='/schedule' render={(routerProps) => (
            <SchedulePage tasks={tasks}/>
          )}/>
          <Redirect exact to='/' />
        </Switch>
      </div>
    </section>
  );
}

export function HomePage(props) {
  const user = {...props.user};
  const tasks = [...props.tasks];
  return (
    <div className='content'>
      <p><em>welcome, {user.displayName}</em></p>
      <p><em>'growth happens little by little, day by day.'</em></p>
      <div className='key'>
        <li><i className='fas fa-seedling' aria-label='seed'></i>= in progress</li>
        <li><i className='fab fa-pagelines' aria-label='leaf'></i>= complete</li>
      </div>

      <NavLink to='/task/new'>
        <button className='key add'>
          <li><i className='fas fa-plus-circle' aria-label='circle with plus sign'></i>Add New Task</li>
        </button>
      </ NavLink>

      <TaskBox username={user.displayName} tasks={props.tasks} />
    </div>
  );
}

export function TaskBox(props) {
  let taskList = [];
  let completedList = [];
  props.tasks.forEach((task) => {
    // sort into current and completed lists
    if (!task.complete) {
      taskList.push(task);
    } else {
      completedList.push(task);
    }
  });

  return (
    <div className='container'>
        <div className='row'>
            <div className='col d-flex'>
                <TaskCard username={props.username} tasks={taskList} isTaskList={true}/>
            </div>
            <div className='col d-flex'>
                <TaskCard username={props.username} tasks={completedList} isTaskList={false}/>
            </div>
        </div>
    </div>
  );
}

export function TaskCard(props) {
  const [ isToday, setIsToday ] = useState(true);

  let title;
  let navs;
  let todayTasks;
  let thisWeekTasks;

  if (props.isTaskList) {
    title = 'current tasks';
  } else {
    title = 'completed tasks';
  }

  const toggleIsToday = () => {
    setIsToday(!isToday);
  };

  navs = (
    <li className='nav-item'>
      <a className={'nav-link' + (isToday ? ' active' : '')} onClick={toggleIsToday} href='#'>{'today'}</a>
      <a className={'nav-link' + (!isToday ? ' active' : '')} onClick={toggleIsToday} href='#'>{'this week'}</a>
    </li>
  );

  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // reset the time of the current date
  let nextWeekDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7);

  let todayTaskList = [];
  todayTaskList = props.tasks.filter(task => {
    let taskDate = new Date(task.deadline);
    return taskDate.getTime() === currentDate.getTime();
  });

  let thisWeekTaskList = [];
  thisWeekTaskList = props.tasks.filter(task => {
    let taskDate = new Date(task.deadline);
    return (taskDate > currentDate) && (taskDate <= nextWeekDate);
  });

  todayTasks = todayTaskList;
  thisWeekTasks = thisWeekTaskList;

  return (
    <div className='card mb-4'>
      <div className='card-header' role='navigation'>
          <h2 className='mb-4'>{title}</h2>
          <ul className='nav nav-tabs card-header-tabs'>
            {navs}
          </ul>
      </div>

      <div className={'card-body ' + title + '-list'}>
          <div className='row'>
              <div className='col-sm'>
                {(isToday ?
                  <TaskList
                    username={props.username}
                    tasks={todayTasks}
                  />
                  :
                  <TaskList
                    username={props.username}
                    tasks={thisWeekTasks}
                  />)}
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
      // pass username, task info, and task key twice (once as React key, again for querying the database)
      <TaskItem username={props.username} name={task.name} desc={task.desc} deadline={task.deadline} key={task.key} queryKey={task.key} complete={task.complete} />
    );
  } else {
    taskItems = undefined;
  }

  return (
      <ul className='list-group list-group-flush'>
        {taskItems}
      </ul>
  );
}

export function TaskItem(props) {
  let taskName = props.name;
  let queryString = props.username + '/tasks/' + props.queryKey;

  // set up initial state
  let icon;
  if (!props.complete) {
      icon = <i className='fas fa-seedling' aria-label='seed'></i>
  } else {
      icon = <i className='fab fa-pagelines' aria-label='leaf'></i>
  }

  const handleClick = (event) => {
    firebase.database().ref(queryString).set({name: taskName, desc: props.desc, deadline: props.deadline, complete: !props.complete});
  }

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    firebase.database().ref(queryString).remove();
  }

  return (
      <li className='list-group-item' onClick={handleClick}>
        <div>
          {icon}
          {taskName}
        </div>
        <i className='fa fa-window-close' onClick={handleDeleteClick} aria-label='exit' aria-hidden='true'></i>
      </li>
  );
}

export default App;
