import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import firebase from "firebase";
import { Link } from "react-router-dom";
import { Avatar, Modal, Input, Button } from "@material-ui/core";
import "./post.css";
import "../posts/posts.css";
import redHeart from "../../assets/redHeart.png";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function Post({
  postId,
  user,
  username,
  caption,
  imageUrl,
  noLikes,
  postUserId,
  photoUrl,
  location,
}) {
  const classes = useStyles();
  const [postUser, setPostUser] = useState();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState("fa-heart");
  const [dropdown, setDropdown] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (postUserId) {
      const cleanUp = db
        .collection("users")
        .doc(postUserId)
        .onSnapshot((snapshot) => {
          setPostUser(snapshot.data());
        });
      return () => cleanUp();
    }
  }, [postUserId]);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => unsubscribe();
  }, [postId, user.uid]);

  useEffect(() => {
    db.collection("posts")
      .doc(postId)
      .collection("likes")
      .doc(user.uid)
      .get()
      .then((doc2) => {
        if (doc2.data()) {
          if (show == "fa-heart") {
            setShow("fa-heart blue");
          } else {
            setShow("fa-heart");
          }
        }
      });
  }, [postId]);

  const likeHandle = (event) => {
    event.preventDefault();
    if (show == "fa-heart") {
      setShow("fa-heart blue");
    } else {
      setShow("fa-heart");
    }

    db.collection("posts")
      .doc(postId)
      .get()
      .then((docc) => {
        const data = docc.data();
        //console.log(show);
        if (show == "fa-heart") {
          db.collection("posts")
            .doc(postId)
            .collection("likes")
            .doc(user.uid)
            .get()
            .then((doc2) => {
              if (doc2.data()) {
                console.log(doc2.data());
              } else {
                db.collection("posts")
                  .doc(postId)
                  .collection("likes")
                  .doc(user.uid)
                  .set({
                    likes: 1,
                  });
                db.collection("posts")
                  .doc(postId)
                  .update({
                    noLikes: data.noLikes + 1,
                  });
              }
            });
        } else {
          db.collection("posts")
            .doc(postId)
            .collection("likes")
            .doc(user.uid)
            .delete()
            .then(function () {
              db.collection("posts")
                .doc(postId)
                .update({
                  noLikes: data.noLikes - 1,
                });
            });
        }
      });
  };

  const postComment = (e) => {
    e.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user?.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      photoURL: user?.photoURL,
      uid: postUser?.uid,
    });
    setComment("");
  };

  const handleDropdown = () => {
    setDropdown(!dropdown);
  };

  const currentUser = firebase.auth().currentUser.uid;

  const deletePost = (e) => {
    const confirmation = window.confirm("Are you sure to delete this post?");
    if (confirmation === true) {
      db.collection("posts").doc(postId).delete();
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setDropdown(false);
  };

  const updateCaption = () => {
    db.collection("posts").doc(postId).set(
      {
        caption: input,
      },
      { merge: true }
    );
    setOpen(false);
    setInput("");
  };

  return (
    <>
      <Modal
        open={open}
        onClose={(e) => setOpen(false)}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className={classes.paper} style={{ textAlign: "center" }}>
          <Input
            value={input}
            placeholder="Update your caption"
            style={{ width: "100%", marginTop: "auto", fontSize: "15px" }}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            onClick={updateCaption}
            style={{ fontSize: "150%" }}
            disabled={!input}
          >
            Update
          </Button>
        </div>
      </Modal>

      <div className="post">
        <div className="post__header">
          <div className="post__header-avator">
            <Avatar src={photoUrl} />
          </div>
          <div className="post__header-right">
            <div className="post__header-name">{username}</div>
            <div className="post__header-location">{location}</div>
          </div>
          {postUserId === currentUser ? (
            <>
              <div className="post__header-dots" onClick={handleDropdown}>
                <i className="fas fa-ellipsis-v"></i>
              </div>
              <div className={dropdown ? `dropdown` : `initial`}>
                <Link to="/" onClick={handleOpen}>
                  Edit
                </Link>
                <Link to="/" onClick={deletePost}>
                  Delete
                </Link>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
        <div className="post__img">
          <img src={imageUrl} alt="" />
        </div>
        <div className="threeIcons">
          {show == "fa-heart" ? (
            <a href="#" className="like" onClick={likeHandle}>
              {" "}
              <i className={`far ${show}  insta-button reactButton `}></i>
            </a>
          ) : (
            <a href="#" className="like" onClick={likeHandle}>
              {" "}
              <img
                src={redHeart}
                className={`far ${show}  insta-button reactButton `}
              />
            </a>
          )}

          <a href="#" className="">
            {" "}
            <i className="far fa-comment insta-button reactButton"></i>{" "}
          </a>
          <a href="#" className="">
            {" "}
            <i className="far fa-paper-plane insta-button reactButton"></i>{" "}
          </a>
        </div>
        <div className="likes">{noLikes} likes</div>
        <div className="caption-all">
          <div className="caption-username">{username}</div>
          <div className="caption">{caption}</div>
        </div>

        {comments.map((comment) => (
          <div key={comment.timestamp}>
            <div className="viewThis" key={comment.uid}>
              <div className="caption-username">{comment.username}</div>
              <div className="caption">{comment.text}</div>
            </div>
          </div>
        ))}

        <form action="" onSubmit={postComment}>
          <div className="input-group ">
            <input
              type="text"
              className="form-control comment "
              placeholder="Add a Comment.."
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <div className="input-group-append">
              <button className="btn post-button" type="submit">
                {" "}
                Post{" "}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Post;
