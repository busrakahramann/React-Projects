import { Link } from "react-router-dom";
import "./post.css";
import {Component} from "react";


class Post extends Component{   
    

    render(){
        return ( 
        <>
            {this.props.posts.map((post) => {
                
              return <div className="post" key={post.id}>
                <img
                    className="postImg"
                    src={`http://localhost:9000/public/${post.image}`}
                    alt=""
                />
                <div className="postInfo">
                    <div className="postCats">
                    <span className="postCat">
                        <Link className="link" to="/">
                        Music
                        </Link>
                    </span>
                    <span className="postCat">
                        <Link className="link" to="/">
                        Life
                        </Link>
                    </span>
                    </div>
                    <span className="postTitle">
                    <Link  to={`/post/${post.id}`}  className="link"key={post.title}>
                        {post.title}
                    </Link>
                    </span>
                    <hr />
                    <span  className="postDate"key={post.create_at}>{post.create_at}</span>
                </div>
                <p  className="postDesc"key={post.story}>
                    {post.story}
                </p>
                </div>
    })}
            </>
            
        )
        
}}
export default Post;