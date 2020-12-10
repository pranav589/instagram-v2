import React, { useState, useEffect } from "react";
import "./editProfile.css";
import { db, storage } from "../../firebase";
import firebase from "firebase";
import { useParams, useHistory } from "react-router-dom";

function EditProfile({ user }) {
  const [bio, setBio] = useState("");
  const [preview, setPreview] = useState(user.photoURL);
  const [image, setImage] = useState("");
  const { username, uid } = useParams();
  const history = useHistory("");
  const currentUser = firebase.auth().currentUser;

  const handleImageAsFile = (e) => {
    const imageVar = e.target.files[0];
    setImage((image) => imageVar);
    setPreview(URL.createObjectURL(e.target.files[0]));
    console.log(imageVar);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    console.log("start of upload");

    if (image === "") {
      console.log(`not an image, the image file is a ${typeof image}`);
    }

    const uploadTask = storage.ref(`profileImages/${image.name}`).put(image);

    console.log(uploadTask);

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
          .ref("profileImages")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            currentUser
              .updateProfile({
                photoURL: url,
              })
              .then(() => {
                db.collection("users")
                  .doc(uid)
                  .update({
                    photoURL: url,
                  })
                  .then(() => {
                    history.push(`/${username}/${uid}`);
                  });
              });
          });

        setPreview("");
        setImage("");
      }
    );
  };

  useEffect(() => {
    db.collection("users").doc(uid).update({
      bio: bio,
    });
  }, [bio]);

  return (
    <div className="edit">
      <center>
        <form onSubmit={handleUpload}>
          <div className="image">
            <img src={preview} alt="" />

            <input type="file" name="upload" onChange={handleImageAsFile} />
          </div>
          <div className="inputs">
            <input
              type="text"
              placeholder="Bio"
              onChange={(e) => setBio(e.target.value)}
              value={bio}
            />
          </div>
          <button className="update">Save</button>
        </form>
      </center>
    </div>
  );
}

export default EditProfile;
