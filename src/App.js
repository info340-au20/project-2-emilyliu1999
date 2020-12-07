import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

function Header() {
  return (
    <header>
      <div className="nav-bar">
        <div className="side-bar">
          <div className="menu">
            <ul>
              <li><a href="#"><i className="fa fa-bars" aria-label="menu"></i></a></li>
              <li><a href="#"><i className="fas fa-home"></i>home</a></li>
              <li><a href="#"><i className="fas fa-inbox"></i>inbox</a></li>
              <li><a href="#"><i className="far fa-check-circle"></i>my tasks</a></li>
              <li><a href="#"><i className="far fa-calendar-alt"></i>schedule</a></li>
            </ul>
          </div>
          <div className="social-media">
            <li><a href="#"><i className="fab fa-facebook-f" aria-hidden="true"></i></a></li>
            <li><a href="#"><i className="fab fa-instagram" aria-hidden="true"></i></a></li>
            <li><a href="#"><i className="fab fa-twitter" aria-hidden="true"></i></a></li>
          </div>
        </div>
      </div>
    </header>
  );
} 

function MainHeading() {
  return (
      <div className="top-bar">
        <h1>flora & fauna</h1>

        <div className="content">
          <p><em>growth happens little by little, day by day.</em></p>
          <div class="key">
            <li><i className="fas fa-seedling"></i> = in progress</li>
            <li><i className="fab fa-pagelines"></i> = complete</li>
          </div>
        </div>
      </div>
  );
}

function AddTasks() {
  let taskitem = "go to farmer's market & go on a picnic";

  return (
    <li className="list-group-item"><a href="#"><i class="fas fa-seedling"></i></a> {taskitem} </li>
  );
}

function Main() {
  <section>
    <MainHeading />
    <div className="container">
        <div className="row">
            <div className="col d-flex">
                <div className="card mb-4">
                    <div className="card-header" role="navigation">
                        <h2 className="mb-4">My Tasks</h2>
                        <ul className="nav nav-tabs card-header-tabs">
                          <li className="nav-item">
                            <a className="nav-link active" href="#">Current</a>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link disabled" href="#">Upcoming</a>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link disabled" href="#">Completed</a>
                          </li>
                        </ul>
                    </div>
                
                <div className="card-body">
                    <div className="row">
                        <div className="col-sm">
                            <ul className="list-group list-group-flush">
                              <AddTasks />
                            </ul>
                        </div>
                    </div>
                </div>

              </div>
            </div>

        </div>
    </div>
  </section>
}


export default App;
