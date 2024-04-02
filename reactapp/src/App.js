import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

 
  return (
    <div className="App flex justify-center items-center h-screen">
      {!showChat ? (
        <div className="joinChatContainer text-center">
          <h3 className="text-3xl font-semibold mb-4">Join A Chat</h3>
          <input
            type="text"
            placeholder="Your Name.."
            className="w-56 h-10 border border-green-500 rounded px-2 mb-2"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <div className="flex gap-4 flex-col items-center"> 
            <input
              type="text"
              placeholder="Room ID..."
              className="w-56 h-10 border border-green-500 rounded px-2 mb-2"
              onChange={(event) => {
                setRoom(event.target.value);
              }}
            />
            <button
              className="w-60 h-12 bg-green-500 text-white rounded hover:bg-green-700"
              onClick={joinRoom}
            >
              Join A Room
            </button>

            <a
            href="https://imgur.com/a/UBk5Os1"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-40 h-8 bg-purple-800 text-white rounded hover:bg-green-700 flex items-center justify-center"
             >
            Meme 😊
            </a>

          </div>
          
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
