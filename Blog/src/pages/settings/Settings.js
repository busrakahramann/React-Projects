import "./settings.css";
//import Sidebar from "../../components/sidebar/Sidebar";
//import { render } from "@testing-library/react";
import { Component } from "react";
import { connect } from 'react-redux'
import { onDelete } from "../../actions/actions";


class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
            id: ""

        }
        this.handleChange = this.handleChange.bind(this);

    }
    componentDidMount() {
        var url = 'http://localhost:9000/api/users/' + window.location.pathname.split("/").pop();//`'http://localhost:9000/api/users/'+${this.id}`
        console.log(url)
        fetch(url, {
            method: 'GET'

        }).then(response => response.json())
            .then(data => {this.setState({ username: data.username, email: data.email, password: data.password })
            console.log(data)})
        

    }
    handleChange(evt, field) {
        // check it out: we get the evt.target.name (which will be either "email" or "password")
        // and use it to target the key on our `state` object with the same name, using bracket syntax
        this.setState({ [field]: evt.target.value });

    }

    handleSubmit = (event, id) => {

        fetch('http://localhost:9000/api/users/' + window.location.pathname.split("/").pop() + '/update', {

            // We convert the React state to JSON and send it as the POST body
            body: JSON.stringify(this.state),
            method: 'POST',
        }).then(function (response) {
            window.location.href = "/login";
        });


        event.preventDefault();
    }
    onDelete = async (event) => {
        var url = `http://localhost:9000/api/users/${this.props.login.user}/delete`;
        console.log(url)
        this.props.onDelete();
        await fetch(url, {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            method: 'POST',
            mode: 'no-cors',
        }).then(response => window.location.href = "/login")



    }


    render() {
        console.log(this.props)
        return (
            <div className="settings">
                <div className="settingsWrapper">
                    <div className="settingsTitle">
                        <span className="settingsTitleUpdate">Update Your Account</span>
                        <span className="settingsTitleDelete" onClick={(event) => this.onDelete(event, this.props.login.user)}>Delete Account</span>
                    </div>
                    <form className="settingsForm" onSubmit={(event) => this.handleSubmit(event, this.state.id)}>
                        <label>Profile Picture</label>
                        <div className="settingsPP">
                            <img
                                src="https://images.pexels.com/photos/6685428/pexels-photo-6685428.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                                alt=""
                            />
                            <label htmlFor="fileInput">
                                <i className="settingsPPIcon far fa-user-circle"></i>{" "}
                            </label>
                            <input
                                id="fileInput"
                                type="file"
                                style={{ display: "none" }}
                                className="settingsPPInput"
                            />
                        </div>
                        <label>Username</label>
                        <input type="text" value={this.state.username} onChange={(event) => this.handleChange(event, "username")} autoFocus={true}
                        />
                        <label>Email</label>
                        <input type="email" value={this.state.email} onChange={(event) => this.handleChange(event, "email")} autoFocus={true}
                        />
                        <label>Password</label>
                        <input type="password" value={this.state.password} onChange={(event) => this.handleChange(event, "password")} autoFocus={true}
                        />
                        <button className="settingsSubmitButton" type="submit">
                            Update
                        </button>
                    </form>
                </div>

            </div>
        );
    }
}
const mapStateToProps = ({ login }) => {
    return {
        login
    }
}
const mapDispatchToProps = {
    onDelete
  }
export default connect(mapStateToProps, mapDispatchToProps)(Settings);