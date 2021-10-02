import { Component } from "react";
import { Link } from "react-router-dom";
import "./singlePost.css";

class SinglePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: ""

        }

            ;
    }
    componentDidMount() {
        var url = 'http://localhost:9000/api/posts/' + window.location.pathname.split("/").pop();
        console.log(url)
        fetch(url, {
            method: 'GET'
        }).then(response => response.json())
            .then(data => {
                console.log(data)
                this.setState({ posts: data });
            })
    }


    handleSubmit = async (event, id) => {
        var url = `http://localhost:9000/api/posts/${id}/delete`;
        console.log(url)

        await fetch(url, {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            method: 'POST',
            mode: 'no-cors',
        }).then(response=>window.location.href = "/login")

       

    }


    render() {
        console.log(this.state.posts.image)
        return (

            <div className="singlePost">
                <div className="singlePostWrapper">
                    <img
                        className="singlePostImg"
                        src={`http://localhost:9000/public/${this.state.posts.image}`}
                        alt=""
                    />
                    <h1 className="singlePostTitle">
                        {this.state.posts.title}
                        <div className="singlePostEdit" onSubmit={this.handleSubmit}>
                          <Link to={`/updatepost/${this.state.posts.id}`}>
                            <i className="singlePostIcon far fa-edit"></i>
                            </Link>
                            <i className="singlePostIcon far fa-trash-alt" onSubmit={this.handleSubmit}></i>
                            <button className="singlePostIcon far fa-trash-alt" onClick={(event) => this.handleSubmit(event, this.state.posts.id)}></button>
                        </div>
                    </h1>
                    <div className="singlePostInfo">
                        <span>
                            Author:
                            <b className="singlePostAuthor">
                                <Link className="link" to="/posts?username=Busra">
                                    {this.state.posts.name}
                                </Link>
                            </b>
                        </span>
                        <span>{this.state.posts.create_at}</span>
                    </div>
                    <p className="singlePostDesc">
                        {this.state.posts.story}
                    </p>
                </div>
            </div>

        );
    }
}
export default SinglePost;