import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth } from "../../firebase";

import appleStore from "../../assets/applestore.png";
import facebook from "../../assets/facebook-icon.png";
import googleStore from "../../assets/googlestore.png";
import instagramLogo from "../../assets/instagram-logo.png";
import phones from "../../assets/phones.png";
import "./login.css";

function Login({ user }) {
  const history = useHistory("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .then((auth) => {
        history.push("/");
      })
      .catch((err) => {
        if (
          err.message ===
          "The password is invalid or the user does not have a password."
        ) {
          alert("Please check your credentails!");
        } else if (
          err.message ===
          "There is no user record corresponding to this identifier. The user may have been deleted."
        ) {
          alert("Please check your credentails!");
        } else {
          alert(err.message);
        }
      });
  };

  return (
    <div>
      <main>
        <div className="log-in-container">
          <div className="log-in">
            <img src={instagramLogo} className="logo" alt="" />

            <div className="log-in-form">
              <input
                type="text"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button className="log-in-button" type="submit" onClick={login}>
                Log In
              </button>
            </div>

            <span className="or-divider">OR</span>

            <div className="fb-login">
              <Link to="#">
                <img src={facebook} alt="" />
                <span>Log in with Facebook</span>
              </Link>
            </div>

            <Link to="#">Forgot password?</Link>
          </div>

          <div className="sign-up">
            <span>Don't have an account?</span>
            <Link to="/signup">Sign up</Link>
          </div>

          <div className="get-the-app">
            <span>Get the app</span>
            <div className="app-images">
              <Link to="#">
                <img src={appleStore} alt="" />
              </Link>
              <Link to="#">
                <img src={googleStore} alt="" />
              </Link>
            </div>
          </div>
        </div>

        <div className="phones-container">
          <img src={phones} alt="" />
        </div>
      </main>
      <footer>
        <ul className="footer-links">
          <li>
            <Link to="#">ABOUT</Link>
          </li>
          <li>
            <Link to="#">HELP</Link>
          </li>
          <li>
            <Link to="#">PRESS</Link>
          </li>
          <li>
            <Link to="#">API</Link>
          </li>
          <li>
            <Link to="#">JOBS</Link>
          </li>
          <li>
            <Link to="#">PRIVACY</Link>
          </li>
          <li>
            <Link to="#">TERMS</Link>
          </li>
          <li>
            <Link to="#">LOCATIONS</Link>
          </li>
          <li>
            <Link to="#">TOP</Link>
          </li>
          <li>
            <Link to="#">ACCOUNTS</Link>
          </li>
          <li>
            <Link to="#">HASHTAGS</Link>
          </li>
          <li>
            <Link to="#">LANGUAGE</Link>
          </li>
        </ul>
        <span className="copyright">&copy; 2020 INSTAGRAM FROM FACEBOOK</span>
      </footer>
    </div>
  );
}

export default Login;
