import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth, db } from "../../firebase";
import firebase from "firebase";

import appleStore from "../../assets/applestore.png";
import facebook from "../../assets/facebook-icon.png";
import googleStore from "../../assets/googlestore.png";
import instagramLogo from "../../assets/instagram-logo.png";
import phones from "../../assets/phones.png";
import profile from "../../assets/profile.png";
import "../login/login.css";

function SignUp() {
  const history = useHistory("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");

  const signup = (e) => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email, password).then((auth) => {
      if (auth.user) {
        auth.user
          .updateProfile({
            displayName: fullName,
            photoURL: profile,
          })
          .then((s) => {
            db.collection("users").doc(auth.user.uid).set({
              uid: auth.user.uid,
              displayName: fullName,
              email: auth.user.email,
              photoURL: profile,
              bio: "",
              username: username,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
          })
          .then((r) => {
            history.push("/");
          });
      }
    });
  };

  return (
    <div>
      <main>
        <div className="log-in-container">
          <div className="log-in">
            <img src={instagramLogo} className="logo" alt="" />

            <span className="signup-span">
              Sign up to see photos and videos from your friends.
            </span>

            <div className="fb-login log-in-button">
              <Link to="#">
                <img src={facebook} alt="" />
                <span>Sign Up with Facebook</span>
              </Link>
            </div>

            <span className="or-divider signup-or">OR</span>

            <div className="log-in-form">
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />

              <input
                type="text"
                placeholder="Full Name"
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
              />
              <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />

              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />

              <button className="log-in-button" type="submit" onClick={signup}>
                Sign Up
              </button>
            </div>
          </div>

          <div className="sign-up">
            <span>Have an account?</span>
            <Link to="/login">Login</Link>
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

export default SignUp;
