import React, { Component } from 'react';
import { browserHistory } from 'react-router'

class Account extends Component {
  constructor(props) {
    super(props)

    this.transfer = this.transfer.bind(this)

    this.state = {
      allUsers: [],
      amountToTransfer: 0,
      usernameToTransferTo: "",
    }

  }

  logout() {
    localStorage.removeItem('username')
    localStorage.removeItem('balance')
    browserHistory.push('/')
  }

  refreshAccount() {
    var un = localStorage.getItem('username')

    if(localStorage.getItem('username') != null) {
      fetch("http://localhost:5000/bambank/user", {
        method: "POST",
        body: JSON.stringify({
          username: un
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
        if(data) {
          console.log("Refreshed user data: ", data)
        }
      })
    }
  }

  getAllUsers() {
    fetch("http://localhost:5000/bambank/allUsers")
      .then(res => res.json())
      .then(data => {
        for(let i=0; i < data.length; i++) {

          this.setState({
            allUsers: this.state.allUsers.concat(data[i].username)
          })
        }
      })
  }

  onAmountChange(event) {
    this.setState({
      amountToTransfer: event.target.value
    })
  }

  onUserChange(event) {
    this.setState({
      usernameToTransferTo: event.target.value
    })

  }

  transfer() {
    console.log("Username transfer: " + this.state.usernameToTransferTo)
    console.log("Amount transfer: " + this.state.amountToTransfer)

    console.log("My username: " + localStorage.getItem('username'))

    fetch("http://localhost:5000/bambank/transfer", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userSending: localStorage.getItem('username'),
        userReceiving: this.state.usernameToTransferTo,
        amount: this.state.amountToTransfer
      })
    })
  }

  componentWillMount() {
    //this.refreshAccount();

    this.getAllUsers();

  }

  render() {
    var username = localStorage.getItem('username')
    var balance = localStorage.getItem('balance')

    return (
      <div>
        <h3>Account Overview</h3>

        <div>Balance:</div>
        <p>{balance}</p>

        <div>Transfer to</div>
        <select onChange={(e) => this.onUserChange(e)}>
          {this.state.allUsers.map((user, i) => <option key={i}>{user}</option>)}
        </select>
        <p>
          Amount:
          <input type="number" onChange={(e) => this.onAmountChange(e)} />
          <button onClick={this.transfer}>Transfer</button>
        </p>

        <br/>
        <div>
          <button onClick={this.logout}>Logout</button>
        </div>

      </div>
    );
  }
}

export default Account;
