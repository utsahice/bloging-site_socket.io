import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./index.css";
const socket = io("http://localhost:3000");

function App() {
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    socket.on("allComments", (comments) => {
      setComments(comments);
    });

    socket.on("newComment", (comment) => {
      setComments((prev) => [...prev, comment]);
    });

    return () => {
      socket.off("allComments");
      socket.off("newComment");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author || !content) return;

    const res = await fetch("http://localhost:3000/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author, content }),
    });

    if (res.ok) {
      setContent("");
    } else {
      alert("Failed to post comment");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Real-time Comments</h1>

      <ul>
        {comments.map((c) => (
          <li key={c.id}>
            <b>{c.author}:</b> {c.content}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <input
          placeholder="Your comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Post Comment</button>
      </form>
    </div>
  );
}

export default App;
