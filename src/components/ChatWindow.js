import React, { useEffect, useState } from "react";
import { fireStoreRef } from "../firebase";
import profilePlaceholder from "../images/profilePlaceholder.png";
import background from "../images/whatsappBg.png";

const ChatWindow = (props) => {
  const [chatData, setChatData] = useState(null);
  const [text, setText] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  useEffect(() => {
    if (props.currentChat !== null) {
      // setting up the listner
      fireStoreRef()
        .collection("chats")
        .doc(props.currentChat.chatId)
        .onSnapshot((snapShot) => {
          setChatData(snapShot.data());
        });
    } else {
      setChatData(null);
    }
  }, [props]);

  const renderMyText = (content, time) => {
    return (
      <div className="flex justify-end mb-2">
        <div
          className="rounded py-2 px-3 pl-4"
          style={{ backgroundColor: "#E2F7CB" }}
        >
          <p className="text-sm mt-1">{content}</p>
          <p className="text-right text-xs text-gray-600 mt-1">{time}</p>
        </div>
      </div>
    );
  };

  const renderFriendText = (content, time) => {
    return (
      <div className="flex mb-2">
        <div className="rounded py-2 px-3 bg-white">
          <p className="text-sm mt-1">{content}</p>
          <p className="text-right text-xs text-gray-600 mt-1">{time}</p>
        </div>
      </div>
    );
  };

  const renderChats = (data) => {
    console.log(data);
    if (data?.length > 0) {
      return data?.map((msg, index) => {
        let time = new Date(msg.timeStamp).toLocaleString("en-US");
        if (msg.authorId === props.auth.uid) {
          return renderMyText(msg.content, time);
        } else {
          return renderFriendText(msg.content, time);
        }
      });
    } else {
      return (
        <div className="text-center text-gray-600 mt-4">
          {`Say hi to ${props?.friendInfo?.name}`}
        </div>
      );
    }
  };

  const sendText = (text) => {
    fireStoreRef()
      .collection("chats")
      .doc(props.currentChat.chatId)
      .update({
        messages: [
          ...chatData.messages,
          {
            authorId: props.auth.uid,
            type: "text",
            content: text,
            timeStamp: Date.now(),
          },
        ],
      })
      .then((res) => {
        setText("");
      });
  };

  const showFriendProfile = () => {
    return <></>;
  };
  return (
    <div className="w-full h-full flex flex-col border border-gray-200">
      <div className="flex items-center w-full bg-gray-100 px-4 py-3">
        <img
          className="w-10 h-10 rounded-full"
          src={
            props.friendInfo?.photoUrl.length > 0
              ? props?.friendInfo?.photoUrl
              : profilePlaceholder
          }
          onClick={() => showFriendProfile()}
        />
        <div
          className="font-semibold ml-4 mr-auto"
          onClick={() => showFriendProfile()}
        >
          {props?.friendInfo?.name}
        </div>
      </div>
      <div className="bg-whatsapp bg-opacity-25 w-full h-full flex flex-col px-4 py-4 justify-end">
        {renderChats(chatData?.messages)}
      </div>
      <div className="bg-white w-full h-16 flex items-center py-2 px-2">
        <input
          className="rounded w-full h-full border border-gray-300 outline-none px-4"
          placeholder="Enter your message"
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <button
          className="px-3 bg-green-500 rounded h-full text-white ml-4"
          onClick={() => sendText(text)}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
