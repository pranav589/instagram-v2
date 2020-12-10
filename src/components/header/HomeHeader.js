import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { db, auth } from "../../firebase";
import { useStateValue } from "../../StateProvider";
import { Avatar } from "@material-ui/core";
import "./homeHeader.css";

function HomeHeader({ user }) {
  const history = useHistory("");
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [{ notifications }, dispatch] = useStateValue();
  const [profileDown, setProfileDown] = useState(false);

  useEffect(() => {
    const cleanUp = db.collection("posts").onSnapshot((snapshot) => {
      snapshot.docs.map((doc) => {
        console.log(doc.data());
        console.log(user);
        if (doc.data().uid == user.uid) {
          db.collection("posts")
            .doc(doc.id)
            .collection("comments")
            .onSnapshot((snapshot) => {
              snapshot.docs.map((doc) => {
                console.log(doc.data());
                if (doc.data().uid !== user.uid) {
                  dispatch({
                    type: "ADD_TO_NOTIFICATIONS",
                    item: {
                      notification: doc.data(),
                    },
                  });
                }
              });
            });
        }
      });
    });

    return () => cleanUp();
  }, [user]);

  useEffect(() => {
    const cleanUp = db.collection("users").onSnapshot((snapshot) => {
      setUsers(snapshot.docs.map((doc) => doc.data()));
    });

    if (users !== undefined) {
      const finalUsers = users.filter((user) => {
        return (
          user.displayName.toLowerCase().indexOf(searchTerm.toLowerCase()) !==
          -1
        );
      });

      setFilteredUsers(finalUsers);
    }

    return () => cleanUp();
  }, [searchTerm, users]);

  const updateSearchResult = (e) => {
    setSearchTerm(e.target.value);
    setSearch(true);
  };

  const collapseNavbar = () => {
    setSearch(false);
  };

  const notificationBlur = () => {
    setNotificationsOpen(false);
    document
      .getElementsByClassName("dropdown-content2")[0]
      .classList.remove("block");

    setProfileDown(false);
    document
      .getElementsByClassName("dropdown-content")[0]
      .classList.remove("block");
  };

  const renderNotifications = () => {
    if (notificationsOpen) {
      setNotificationsOpen(false);
      document
        .getElementsByClassName("dropdown-content2")[0]
        .classList.remove("block");
    } else {
      setNotificationsOpen(true);
      document
        .getElementsByClassName("dropdown-content2")[0]
        .classList.add("block");
    }
  };

  const renderProfile = () => {
    if (profileDown) {
      setProfileDown(false);
      document
        .getElementsByClassName("dropdown-content")[0]
        .classList.remove("block");
    } else {
      setProfileDown(true);
      setNotificationsOpen(false);
      document
        .getElementsByClassName("dropdown-content2")[0]
        .classList.remove("block");
      document
        .getElementsByClassName("dropdown-content")[0]
        .classList.add("block");
    }
  };

  const logout = () => {
    if (user) {
      auth
        .signOut()
        .then(() => {
          history.push("/login");
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  const redirect = () => {
    history.push(`/${user.displayName}/${user.uid}`);
    notificationBlur();
  };

  return (
    <nav className="navbar navbar-expand navbar-light navbar-inverse navbar-fixed-top ">
      <Link className="navbar-brand logo " to="/">
        <img
          src="https://raw.githubusercontent.com/codingvenue/instagram-hompage-clone-bootstrap/master/assets/images/ig-logo.png"
          alt=""
          className="mt-auto"
        />
      </Link>

      <div className="wrapper">
        <div className={search ? `search-input active` : `search-input`}>
          <input
            type="text"
            placeholder="Search"
            onKeyPress={updateSearchResult}
            className="searchbox"
          />
          <div className={`autocom-box`}>
            {users !== undefined &&
              filteredUsers.map((user1) => (
                <li key={user1.uid}>
                  <Link
                    to={`/${user1.username}/${user1.uid}`}
                    onClick={collapseNavbar}
                  >
                    <Avatar className="searchAvatar" src={user1.photoURL} />
                    <h3 className="searchH3">{user1.displayName}</h3>
                  </Link>
                </li>
              ))}
          </div>
          <div className="icon">
            <i className="fas fa-search"></i>
          </div>
        </div>
      </div>

      <ul className="navbar-nav mr-auto nav-right-items header-icons">
        <li className="nav-item">
          <Link className="nav-link" to="/">
            <i className="fas fa-home nav-icons selected"></i>
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link " to="/">
            <i className="far fa-compass nav-icons hide"></i>
          </Link>
        </li>
        <li className="nav-item ">
          <div className="nav-link" onBlur={notificationBlur}>
            <i
              className={
                notificationsOpen
                  ? `fas fa-heart nav-icons`
                  : `far fa-heart nav-icons`
              }
              onClick={renderNotifications}
            ></i>
            <div className="dropdown-content2">
              <h1>Notifications</h1>
              <div className="hr" />
              {notifications.length === 0 ? (
                <div className="noNotifDiv">
                  <h3 className="noNotif">No active notfications </h3>
                </div>
              ) : (
                console.log()
              )}
              {notifications.map((notification) => (
                <Link to="#" className="announcement">
                  <div className="optionDrop">
                    <Avatar src="" />
                    <div className="announcementInfo">
                      <h1>
                        {notification.username}{" "}
                        <span>commented to your post.</span>
                      </h1>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </li>

        <li className="nav-item">
          <Link className="nav-link " to="/createPost">
            <i className="fas fa-upload nav-icons"></i>
          </Link>
        </li>

        <li className="nav-item ">
          <Link to="#" className="nav-link" onBlur={notificationBlur}>
            <img
              src={user && user.photoURL}
              alt="profile"
              height="26"
              className="round"
              onClick={renderProfile}
            />
            <div className="dropdown-content">
              <div className="options" onClick={redirect}>
                <img src={user && user.photoURL} alt="" className="Avatar" />
                <h3>{user && user.displayName}</h3>
              </div>

              <div className="options">
                <i className="far fa-save  Avatar"></i>
                <h3>Saved</h3>
              </div>

              <div className="options">
                <i className="fas fa-cog Avatar"></i>
                <h3>Settings</h3>
              </div>

              <div className="options">
                <i className="fas fa-toggle-off Avatar"></i>
                <h3>Switch Accounts</h3>
              </div>

              <div className="hr" />

              <div className="options" onClick={logout}>
                <i className="fas fa-sign-out-alt Avatar"></i>
                <h3>Logout</h3>
              </div>
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default HomeHeader;
