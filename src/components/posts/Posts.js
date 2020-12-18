import { useState, useEffect } from "react";
import { db } from "../../firebase";
import Post from "../post/Post";
import "./posts.css";

const Posts = ({ user }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const cleanUp = db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => {
        setPosts(
          snap.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
    return () => cleanUp();
  }, []);

  return (
    <div className="posts">
      {posts.map(({ post, id }) => (
        <Post
          key={id}
          postId={id}
          user={user}
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
          noLikes={post.noLikes}
          postUserId={post.uid}
          location={post.location}
          photoUrl={post.photoUrl}
        />
      ))}
    </div>
  );
};

export default Posts;
