import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Router, Route, browserHistory } from 'react-router'
import Login from './components/Login'
import Account from './components/Account'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Bambank</h1>
        </header>

        <Router history={browserHistory}>
          <Route path="/" component={Login} />
          <Route path="/account" component={Account} />
        </Router>

      </div>
    );
  }
}

export default App;
