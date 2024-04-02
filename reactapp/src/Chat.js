import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage.trim() !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
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
    <div className="flex flex-col h-96 w-96 bg-gray-100 rounded-lg"> 
      <div className="flex flex-col flex-grow overflow-auto">
        <div className="flex justify-center p-4 bg-gray-800 text-white rounded-t-lg"> 
          <p className="text-xl font-bold">Live Chat</p>
        </div>
        <ScrollToBottom className="p-4">
          {messageList.map((messageContent, index) => (
            <div
              key={index}
              className={`flex ${
                username === messageContent.author ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <div
                className={`p-2 max-w-md rounded-lg ${
                  username === messageContent.author
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                <p className="font-semibold">{messageContent.author}</p>
                <p>{messageContent.message}</p>
                <p className="text-xs text-gray-500">{messageContent.time}</p>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="flex justify-center p-4 bg-gray-800 rounded-b-lg">
        <input
          type="text"
          value={currentMessage}
          placeholder="Type your message here..."
          className="flex-grow px-4 py-2 mr-2 bg-white rounded-lg outline-none"
          onChange={(event) => setCurrentMessage(event.target.value)}
          onClick={(event) => {
            if (event.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 text-white bg-green-500 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
