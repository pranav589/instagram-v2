import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { db } from "../../firebase";
import firebase from "firebase";

import "./profile.css";

function Profile() {
  const { username, uid } = useParams();
  const history = useHistory("");
  const [profileData, setProfileData] = useState([]);
  const [posts, setPosts] = useState([]);
  const [myProfile, setMyProfile] = useState([]);
  const user = firebase.auth().currentUser;

  useEffect(() => {
    const cleanUp = db
      .collection("users")
      .doc(uid)
      .onSnapshot((doc) => {
        setProfileData(doc.data());
      });
    return () => cleanUp();
  }, []);

  useEffect(() => {
    const cleanUp = db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
    return () => cleanUp();
  }, [posts]);

  useEffect(() => {
    const profile = posts.filter((res) => res.post.uid == uid);
    setMyProfile(profile);
  }, [posts]);


  const editProfile = (e) => {
    e.preventDefault();
    history.push(`/${user.displayName}/${user.uid}/editProfile`);
  };

  return (
    <>
      <header>
        <div className="container">
          <div className="profile">
            <div className="profile-image">
              <img src={profileData.photoURL} alt="" />
            </div>

            <div className="profile-user-settings">
              <h1 className="profile-user-name">{username}</h1>

              {profileData.uid === user.uid ? (
                <button className="btn profile-edit-btn" onClick={editProfile}>
                  Edit Profile
                </button>
              ) : (
                ""
              )}

              <button
                className="btn profile-settings-btn"
                aria-label="profile settings"
              >
                <i className="fas fa-cog" aria-hidden="true"></i>
              </button>
            </div>

            <div className="profile-stats">
              <ul>
                <li>
                  <span className="profile-stat-count">{myProfile.length}</span>{" "}
                  posts
                </li>
              </ul>
            </div>

            <div className="profile-bio">
              <p>
                <span className="profile-real-name">{username}</span>{" "}
                {profileData.bio}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="container">
          <div className="gallery">
            {myProfile.map((res) => (
              <div key={res.id}>
                <div className="gallery-item" tabIndex="0">
                  <img
                    src={res.post.imageUrl}
                    className="gallery-image"
                    alt=""
                  />

                  <div className="gallery-item-info">
                    <ul>
                      <li className="gallery-item-likes">
                        <span className="visually-hidden">Likes:</span>
                        <i className="fas fa-heart" aria-hidden="true"></i>{" "}
                        {res.post.noLikes}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export default Profile;
