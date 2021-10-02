import { Component } from "react";
//import Sidebar from "../../components/sidebar/Sidebar";
import SinglePost from "../../components/singlePost/SinglePost";
import "./single.css";

class Single extends Component{
    
    render() {
        return (
            <div className="single">
            <SinglePost />
           
            </div>
        );
    }
}
export default Single;