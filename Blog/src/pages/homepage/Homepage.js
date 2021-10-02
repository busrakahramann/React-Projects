import React from "react";
import { Component } from "react";

//import { BrowserRouter as useLocation } from "react-router-dom";
import Header from "../../components/header/Header";
import Post from "../../components/post/Post";
//import Sidebar from "../../components/sidebar/Sidebar";
import "./homepage.css";

class Homepage extends Component{
    constructor(props){
        super(props);
        this.state={
            posts:[]
        }

    }
    async getData(){
        
            await fetch('http://localhost:9000/api/posts', {
            method: 'GET',
          }).then(response => response.json())
          .then(response => {
            
            this.setState({posts:response})
          });
        
    }
    componentDidMount(){
           
        this.getData()

    }

    render() {
        console.log(this.state.posts)
        //const location = useLocation();
        
        return (
            <>
            <Header />
            <div className="home">
                <Post posts={this.state.posts} />
                
            </div>
            </>
        );
    }
}
export default Homepage;