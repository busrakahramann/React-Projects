//import { render } from "@testing-library/react";
import { Component } from "react";
import "./header.css";

class Header extends Component{ 
   render(){  
     return (
      <div className="header">
        <div className="headerTitles">
          
          <span className="headerTitleLg">BLOG</span>
        </div>
        <img
          className="headerImg"
          src="https://www.wallpapertip.com/wmimgs/88-882253_wallpaper-road-desert-mountains-horizon-asphalt-desert-road.jpg"
          alt=""
        />
      </div>
  );
}
}
export default Header;