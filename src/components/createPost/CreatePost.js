import React, { useState } from "react";
import Spinner from "../shared/Spinner";
import { storage, db, auth } from "../../firebase";
import { useHistory } from "react-router-dom";
import firebase from "firebase";

import "./createPost.css";
const CreatePost = () => {
  const history = useHistory("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");

  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [noLikes, setNoLikes] = useState(0);
  const [preview, setPreview] = useState("");
  const user = firebase.auth().currentUser;

  const handleImageAsFile = (e) => {
    const imageVar = e.target.files[0];
    setImage((image) => imageVar);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleUpload = (e) => {
    e.preventDefault();
    console.log("start of upload");

    if (image === "") {
      console.log(`not an image, the image file is a ${typeof image}`);
    }

    const uploadTask = storage.ref(`/images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: user && user.displayName,
              location: location,
              noLikes: noLikes,
              photoUrl: user && user.photoURL,
              uid: user && user.uid,
            });
          })
          .then(() => {
            history.push("/");
          });
        setLocation("");
        setCaption("");
        setImage(null);
        setPreview("");
      }
    );
  };

  const styleUpload = {
    display: image ? "block" : "none",
  };

  return (
    <div className="create_post">
      <div className="upload">
        <input
          type="file"
          name="file"
          id="file_up"
          onChange={handleImageAsFile}
        />
        {loading ? (
          <div id="file_img">
            <Spinner />
          </div>
        ) : (
          <div id="file_img" style={styleUpload}>
            <img src={preview} alt="" />
            <span>X</span>
          </div>
        )}
      </div>

      <form action="" onSubmit={handleUpload}>
        <div className="row">
          <label htmlFor="captions">Captions</label>
          <input
            type="text"
            name="captions"
            id="captions"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        <div className="row">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            name="Location"
            id="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default CreatePost;
