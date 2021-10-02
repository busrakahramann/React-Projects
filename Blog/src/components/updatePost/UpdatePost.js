import React, { Component } from "react";
import "./updatePost.css";

class Write extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            story: "",
            id:""

        }
        this.handleChange = this.handleChange.bind(this);

    }
    componentDidMount() {
        var url = 'http://localhost:9000/api/posts/' + window.location.pathname.split("/").pop();
        console.log(url)
        fetch(url, {
            method: 'GET'

        }).then(response => response.json())
            .then(data => this.setState({ title: data.title, story: data.story }));


    }
    handleChange(evt, field) {
        // check it out: we get the evt.target.name (which will be either "email" or "password")
        // and use it to target the key on our `state` object with the same name, using bracket syntax
        this.setState({ [field]: evt.target.value });
        console.log(this.state.title)
    }

    handleSubmit = (event, id) => {

        fetch('http://localhost:9000/api/posts/'+ window.location.pathname.split("/").pop()+'/update', {

            // We convert the React state to JSON and send it as the POST body
            body: JSON.stringify(this.state),
            method: 'POST',
        }).then(function (response) {
            window.location.href = "/login";
        });


        event.preventDefault();
    }

    render() {
        

        return (
            <div className="write">
                <img
                    className="writeImg"
                    src="https://images.pexels.com/photos/6685428/pexels-photo-6685428.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                    alt=""
                />
                <form className="writeForm" onSubmit={(event) => this.handleSubmit(event, this.state.id)}>
                    <div className="writeFormGroup">
                        <label htmlFor="fileInput">
                            <i className="writeIcon fas fa-plus"></i>
                        </label>
                        <input id="fileInput" type="file" style={{ display: "none" }} />
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
export default Write;