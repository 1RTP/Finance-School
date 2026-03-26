import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("message", (msg) => setMessages((prev) => [...prev, msg]));
    return () => socket.off("message");
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("message", input);
      setInput("");
    }
  };

  return (
    <div className="form-container">
  <h2>Чат підтримки</h2>
  <div className="chat-messages">
    {messages.map((m, i) => (
      <div
        key={i}
        className={`chat-message ${i % 2 === 0 ? "sent" : "received"}`}
      >
        {m}
      </div>
    ))}
  </div>
  <div className="chat-input">
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Введіть повідомлення..."
    />
    <button onClick={sendMessage}>Надіслати</button>
  </div>
</div>
  );
}

export default Chat;
