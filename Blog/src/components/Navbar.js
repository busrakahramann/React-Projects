import React, { Component } from "react";
import { Link } from 'react-router-dom';
import "./Navbar.css"
import { connect } from 'react-redux'
//import { Link } from 'react-router-dom';
class Navbar extends Component {
    
    handleSubmit = async (event) => {
        event.preventDefault()
        await localStorage.removeItem("user")
        window.location.href = "/";}
    render() {
        console.log(this.props.login)
        const user = true;
        return (
            <div className="top">
                <div className="topLeft">
                    <i className="topIcon fab fa-facebook-square" href="www.facebook.com"></i>
                    <i className="topIcon fab fa-instagram-square"></i>
                    <i className="topIcon fab fa-pinterest-square"></i>
                    <i className="topIcon fab fa-twitter-square"></i>
                </div>
                <div className="topCenter">
                    <ul className="topList">
                        <li className="topListItem">
                            <Link className="link" to="/">
                                HOME
                            </Link>
                        </li>
                        <li className="topListItem">ABOUT</li>
                        <li className="topListItem">CONTACT</li>
                        <li className="topListItem">
                            <Link className="link" to='/write'  >
                                WRITE
                            </Link>
                        </li>    
                        {
                        localStorage.getItem('user')?
                        <>
                        <li className="topListItem">
                            <Link className="link" onClick={(event) => this.handleSubmit(event)} to='/login'  >
                                LOGOUT
                            </Link>   
                        </li>
                        </>:
                        <>
                        <li className="topListItem">
                            <Link className="link" to='/login'  >
                                LOGIN
                            </Link>   
                        </li>     
                        <li className="topListItem">
                            <Link className="link" to='/register'  >
                                REGISTER
                            </Link>    
                        </li>
                      
                        </>



                    }
                          {/* {user && <li className="topListItem">LOGOUT</li>} */}
                    </ul>
                </div>
                <div className="topRight">
                    {user ? (
                        <Link className="link" to={`/settings/${this.props.login.user}`} >
                            <img
                                className="topImg"
                                src="https://images.pexels.com/photos/6685428/pexels-photo-6685428.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                                alt=""
                            />
                        </Link>
                    ) : (
                        <ul className="topList">
                            <li className="topListItem">
                                <Link className="link" to="/login">
                                    LOGIN
                                </Link>
                            </li>
                            <li className="topListItem">
                                <Link className="link" to="/register">
                                    REGISTER
                                </Link>
                            </li>
                        </ul>
                    )}
                    
                </div>
            </div >

            
        )
    }
}
const mapStateToProps = ({login}) => {
    return {
        login
    }
  }
export default connect(mapStateToProps)(Navbar);