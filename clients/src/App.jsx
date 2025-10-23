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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Real-time Comments
        </h1>

        <ul className="space-y-3 mb-6">
          {comments.length === 0 && (
            <p className="text-gray-500">No comments yet. Be the first!</p>
          )}
          {comments.map((c) => (
            <li
              key={c.id}
              className="bg-gray-50 p-3 rounded-lg border border-gray-200"
            >
              <span className="font-semibold text-indigo-600">{c.author}:</span>{" "}
              <span className="text-gray-700">{c.content}</span>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            type="text"
            placeholder="Your comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
