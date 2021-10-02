import React, { Component } from "react";
import { Link } from 'react-router-dom';
//import Navbar from "../../components/Navbar";
//import {Redirect} from 'react-router-dom';
import "./Login.css";
//import { useHistory } from "react-router-dom";
//import { Redirect } from "react-router";
import { connect } from 'react-redux'
import { onLogin } from "../../actions/actions";
//import store from "../../app/store";



class Login extends Component {
 // userData;
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  handleChange(evt, field) {
    // check it out: we get the evt.target.name (which will be either "email" or "password")
    // and use it to target the key on our `state` object with the same name, using bracket syntax
    this.setState({ [field]: evt.target.value });
  }

  login(id) {
    this.props.onLogin(id)
  }


  handleSubmit = async (event) => {
    event.preventDefault()
    console.log("test")
    await fetch('http://localhost:9000/api/login', {
      method: 'POST',
      // We convert the React state to JSON and send it as the POST body
      body: JSON.stringify(this.state)
    }).then(response => response.json())
      .then(data => {

        if (data.status) {
          this.login(data.id)

          window.location.href = "/";
        } else { alert(data.mesaj) }


      })
   
  }
/*   componentDidMount(){
    this.userData=JSON.parse(localStorage.getItem('user'));
  }

  componentWillUpdate(nextProps,nextState){
    localStorage.setItem('user', JSON.stringify(nextState));
  } */
  render() {


    return (
      <div className="login">
        <span className="loginTitle">Login</span>
        <form className="loginForm" onSubmit={this.handleSubmit}>
          <label>Email</label>
          <input className="loginInput" type="text" value={this.state.email} onChange={(event) => this.handleChange(event, "email")} placeholder="Enter your email..." />
          <label>Password</label>
          <input className="loginInput" type="password" value={this.state.password} onChange={(event) => this.handleChange(event, "password")} placeholder="Enter your password..." />
          <button className="loginButton" onClick={(event) => this.handleSubmit(event)}>Login</button>
        </form>
        <Link className="link" to='/register' >
        <button className="loginRegisterButton">Register</button>
        </Link>

      </div>

    )
  }
}
const mapStateToProps = (state) => {
  return state
}
const mapDispatchToProps = {
  onLogin: onLogin
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);