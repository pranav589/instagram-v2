import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import "./sidebar.css";

const SideBar = ({ userLog }) => {
  const [users, setUsers] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [loggedUser, setLoggedUser] = useState([]);

  useEffect(() => {
    const cleanUp = db.collection("users").onSnapshot((snapshot) => {
      setUsers(snapshot.docs.map((doc) => doc.data()));
    });
    if (users !== undefined) {
      const otherUsersVar = users.filter((user) => userLog.uid !== user.uid);
      otherUsersVar.length = 5;
      setOtherUsers(otherUsersVar);
      const loggedUserVar = users.filter((user) => userLog.uid === user.uid);
      setLoggedUser(loggedUserVar);
    }
    return () => cleanUp();
  }, [users]);

  return (
    <div className="sidebar">
      <div className="sidebar__user">
        {loggedUser.map((logged) => (
          <Link to={`/${logged.username}/${logged.uid}`} key={logged.uid}>
            <div className="me">
              <div className="sidebar__user-avator">
                <Avatar src={logged.photoURL} />
              </div>
              <div className="sidebar__user-name">{logged.username}</div>
            </div>
          </Link>
        ))}
        <div className="sidebar__switch">Switch</div>
      </div>

      <div className="sidebar__list">
        <h3>Suggestions for you</h3>
        {otherUsers.map((otherUser) => (
          <div className="sidebar__list-user" key={otherUser.uid}>
            <Link to={`/${otherUser.username}/${otherUser.uid}`}>
              <div className="sidebar__list-a">
                <div className="sidebar__list-a-img">
                  <img src={otherUser.photoURL} alt={otherUser.displayName} />
                </div>
                <div className="sidebar__list-a-name">{otherUser.username}</div>
              </div>
            </Link>
            <div className="sidebar__list-b">
              <a href="">Follow</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
