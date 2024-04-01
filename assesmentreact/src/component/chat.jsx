import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="bg-gray-100 h-screen flex flex-col justify-between">
      <div className="bg-gray-200 px-4 py-2 flex justify-center items-center">
        <p className="text-xl font-bold">Live Chat</p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <ScrollToBottom className="flex flex-col gap-2">
          {messageList.map((messageContent, index) => (
            <div
              key={index}
              className={`${
                username === messageContent.author ? "self" : "other"
              } flex flex-col gap-1`}
            >
              <div className="bg-white rounded-lg px-4 py-2">
                <p>{messageContent.message}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-xs text-gray-500">{messageContent.time}</p>
                <p className="text-xs text-gray-600">{messageContent.author}</p>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="bg-gray-200 px-4 py-2 flex justify-between items-center">
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 w-full"
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => event.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 flex justify-center items-center"
          onClick={sendMessage}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M11.707 10l3.147-3.146a.5.5 0 0 0-.708-.708L10 9.293 6.854 6.146a.5.5 0 1 0-.708.708L9.293 10l-3.147 3.146a.5.5 0 1 0 .708.708L10 10.707l3.146 3.147a.5.5 0 0 0 .708-.708L10.707 10z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Chat;
