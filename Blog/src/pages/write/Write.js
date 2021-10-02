import React, { Component } from "react";
import "./Write.css";
import {connect} from "react-redux";

class Write extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            title: '',
            image: '',
            story: ''

        };
    }
    onFileChange = event => {

        // Update the state
        this.setState({ image: event.target.files[0] });

    };

    handleChange(evt, field) {
        // check it out: we get the evt.target.name (which will be either "email" or "password")
        // and use it to target the key on our `state` object with the same name, using bracket syntax
        this.setState({ [field]: evt.target.value });
    }

    handleSubmit = (event) => {
        const formData = new FormData();
        formData.append("name", this.state.name);
        formData.append("title", this.state.title);
        formData.append("image", this.state.image);
        formData.append("story", this.state.story);
        formData.append("user_id",this.props.user);

        fetch('http://localhost:9000/api/posts', {
            method: 'POST',

            // We convert the React state to JSON and send it as the POST body
            body: formData

        }).then(function (response) {
            window.location.href = "/login";
        });
        console.log(this.state.image)

        event.preventDefault();
    }

    render() {
        console.log(this.props)
        return (
            <div className="write">
                <img
                    className="writeImg"
                    src="https://images.pexels.com/photos/6685428/pexels-photo-6685428.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                    alt=""
                />
                <form className="writeForm" onSubmit={this.handleSubmit}>
                    <div className="writeFormGroup">
                        <label htmlFor="fileInput">
                            <i className="writeIcon fas fa-plus"></i>
                        </label>
                        <input id="fileInput" type="file" style={{ display: "none" }} onChange={this.onFileChange} />
                        <input
                            className="writeInput"
                            placeholder="Title"
                            value={this.state.title} onChange={(event) => this.handleChange(event, "title")}
                            type="text"
                            autoFocus={true}
                        />
                    </div>
                    <div className="writeFormGroup">
                        <textarea
                            className="writeInput writeText"
                            placeholder="Tell your story..."
                            value={this.state.story} onChange={(event) => this.handleChange(event, "story")}
                            type="text"
                            autoFocus={true}
                        />
                    </div>
                    <button className="writeSubmit" type="submit">
                        Publish
                    </button>
                </form>
            </div>
        );
    }
}
const mapStateToProps = ({login}) => {
    return login
  }
export default connect(mapStateToProps)(Write);