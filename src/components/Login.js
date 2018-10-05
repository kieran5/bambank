import React, { Component } from 'react';
import { browserHistory } from 'react-router'

class Login extends Component {
  constructor(props) {
    super(props)

    this.usernameValChange = this.usernameValChange.bind(this)
    this.pswdValChange = this.pswdValChange.bind(this)

    this.state = {
      usernameVal: "",
      pswdVal: "",
      currentUser: {}
    }

  }

  componentWillMount() {
    // fetch("http://localhost:5000/bambank/user")
    //   .then(res => res.json())
    //   .then(data => {
    //     this.setState({
    //       currentUser: data
    //     })
    //
    //     if(data == "none") {
    //       alert("no user logged in")
    //     }
    //     else {
    //       alert("user already logged in")
    //       browserHistory.push('/account')
    //
    //     }
    //   })

    if(localStorage.getItem('username')) {
      browserHistory.push('/account')
    }
  }

  usernameValChange(event) {
    this.setState({
      usernameVal: event.target.value
    })
  }

  pswdValChange(event) {
    this.setState({
      pswdVal: event.target.value
    })
  }

  register() {
    fetch("http://localhost:5000/bambank/register", {
      method: "POST",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        username: this.state.usernameVal,
        password: this.state.pswdVal
      })
    })
    .then(res => {
      if(res.ok) {
        return res.json()
      }
      else {
        return false
      }
    })
    .then(data => {
      if(data.userId) {
        alert(data.message);
        browserHistory.push('/account')
        localStorage.setItem('username', data.username)
        localStorage.setItem('balance', data.balance)
      }
    })

  }

  login() {
    fetch("http://localhost:5000/bambank/login", {
      method: "POST",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        username: this.state.usernameVal,
        password: this.state.pswdVal
      })
    })
    .then(res => {
      if(res.ok) {
        return res.json()
      }
      else {
        return false
      }
    })
    .then(data => {
      if(data.userId) {
        alert(data.message)

        console.log("MA DATA", data)

        browserHistory.push('/account')
        localStorage.setItem('username', data.username)
        localStorage.setItem('balance', data.balance)
      }
    })
  }

  render() {
    return (
      <div>
        Login / Register

        <div>
          <input type="text" placeholder="Username" name="username" onChange={(e) => this.usernameValChange(e)} />
          <input type="text" placeholder="Password" name="password" onChange={(e) => this.pswdValChange(e)} />
          <button onClick={() => this.register()}>Register</button>
          <button onClick={() => this.login()}>Login</button>
        </div>

      </div>
    );
  }
}

export default Login;
