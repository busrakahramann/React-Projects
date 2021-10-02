import Navbar from "./components/Navbar";
import Homepage from "./pages/homepage/Homepage";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Settings from "./pages/settings/Settings";
import Single from "./pages/single/Single";
import Write from "./pages/write/Write";
import UpdatePost from "./components/updatePost/UpdatePost"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import configureStore from './app/store'
import {Provider} from "react-redux"

const store =configureStore();

function App() {
  
 // const currentUser = false;
  return (
    <Provider store={store}>
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Homepage />
        </Route>
        <Route path="/posts">
          <Homepage />
        </Route>
        
        <Route path="/updatepost">
          <UpdatePost/>
        </Route>
        <Route path="/register">
          {localStorage.getItem('user') ? <Homepage /> : <Register />}
        </Route>
        <Route path="/login">{localStorage.getItem('user')? <Homepage /> : <Login />}</Route>
        <Route path="/post/:id">
          <Single />
        </Route>
        <Route path="/write">{localStorage.getItem('user') ? <Write /> : <Login />}</Route>
        <Route path="/settings">
          {localStorage.getItem('user') ? <Settings /> : <Login />}
        </Route>
      </Switch>
    </Router>
    </Provider>
  );
}

export default App;