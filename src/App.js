import { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Login from "./components/login/Login";
import SignUp from "./components/signup/SignUp";
import HomeHeader from "./components/header/HomeHeader";
import { auth } from "./firebase";
import Stories from "./components/stories/Stories";
import SideBar from "./components/sidebar/SideBar";
import CreatePost from "./components/createPost/CreatePost";
import Posts from "./components/posts/Posts";
import Profile from "./components/profile/Profile";
import EditProfile from "./components/editProfile/EditProfile";

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(false);
      }
    });
  }, []);

  return (
    <div className="App">
      <Router>
        {user && <HomeHeader user={user} selected />}
        <Switch>
          <Route path="/login" exact>
            {!user ? <Login user={user} /> : <Redirect to="/" />}
          </Route>

          <Route path="/signup" exact user={user}>
            {!user ? <SignUp /> : <Redirect to="/" />}
          </Route>

          <Route path="/" exact>
            {user ? (
              <div className="container">
                <Stories user={user} />
                <SideBar userLog={user} />
                <Posts user={user} />
              </div>
            ) : (
              <Redirect to="/login" />
            )}
          </Route>

          <Route path="/createPost" exact>
            {user ? <CreatePost /> : <Redirect to="/login" />}
          </Route>

          <Route path="/:username/:uid" exact>
            {user ? <Profile /> : <Redirect to="/login" />}
          </Route>

          <Route path="/:username/:uid/editProfile" exact>
            {user ? <EditProfile user={user} /> : <Redirect to="/login" />}
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
