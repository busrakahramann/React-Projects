import "./Register.css";
//import {Redirect} from 'react-router-dom';
import React, {Component} from "react";
import { Link } from 'react-router-dom';


class Register extends Component{
    constructor(props) {
        super(props);
        this.state = { username: '',
                        email: '',
                        password: ''
    
    };}

      
        
    
      handleChange (evt, field) {
        // check it out: we get the evt.target.name (which will be either "email" or "password")
        // and use it to target the key on our `state` object with the same name, using bracket syntax
        this.setState({ [field]: evt.target.value });
      }
    
      handleSubmit = (event) => {
    
        fetch('http://localhost:9000/api/users', {
            method: 'POST',
            // We convert the React state to JSON and send it as the POST body
            body: JSON.stringify(this.state)
          }).then(function(response) {
            window.location.href = "/login";
          });

    
        event.preventDefault();
    }
    
    render(){
        
        return (
                <div className="register">
            <span className="registerTitle">Register</span>
            <form className="registerForm" onSubmit={this.handleSubmit}>
                <label>Username</label>
                <input className="registerInput" type="text" value={this.state.username} onChange={(event)=>this.handleChange(event, "username")} placeholder="Enter your username..." />
                <label>Email</label>
                <input className="registerInput" type="text" value={this.state.email} onChange={(event)=>this.handleChange(event, "email")} placeholder="Enter your email..." />
                <label>Password</label>
                <input className="registerInput" type="password" value={this.state.password} onChange={(event)=>this.handleChange(event, "password")} placeholder="Enter your password..." />
                <button className="registerButton">Register</button>
            </form>
            <Link className="link" to='/login' >
                <button className="registerLoginButton">Login</button>
                </Link>
            </div>  
        );
    }
    
}
export default Register;