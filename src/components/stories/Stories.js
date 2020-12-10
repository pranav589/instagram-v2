import React, { useState } from "react";
import "./stories.css";
import { db } from "../../firebase";
import { useEffect } from "react";

const Stories = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const cleanUp = db.collection("users").onSnapshot((snapshot) => {
      setUsers(snapshot.docs.map((doc) => doc.data()));
    });
    return () => cleanUp();
  }, [users]);

  return (
    <div className="stories">
      {users.map((user) => (
        <div className="stories__info" key={user.uid}>
          <div className="stories__img">
            <span>
              <img src={user.photoURL} alt={user.displayName} />
            </span>
          </div>
          <div className="stories__name">{user.displayName}</div>
        </div>
      ))}
    </div>
  );
};

export default Stories;
