import React, { useEffect, useState } from "react";
import { firebaseStorageRef, fireStoreRef } from "../firebase";
import profilePlaceholder from "../images/profilePlaceholder.png";
import fileInputSvg from "../images/fileInput.svg";
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
    if (data?.length > 0) {
      return data?.map((msg, index) => {
        let time = new Date(msg.timeStamp).toLocaleString("en-US");
        let self = msg.authorId === props.auth.uid;
        return renderMessage(msg, self);
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
    if (text.length > 0) {
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
    }
  };

  const renderMessage = (data, self) => {
    console.log(data, self);
    if (self) {
      if (data.type === "image") {
        return (
          <div className="flex justify-end mb-2">
            <div
              className="rounded py-2 px-3 pl-4"
              style={{ backgroundColor: "#E2F7CB" }}
            >
              <img className="rounded lg:w-96 h-auto" src={data.content} />
              <p className="text-right text-xs text-gray-600 mt-1">
                {new Date(data.timeStamp).toLocaleString()}
              </p>
            </div>
          </div>
        );
      } else if (data.type === "text") {
        return renderMyText(
          data.content,
          new Date(data.timeStamp).toLocaleString()
        );
      }
    } else {
      if (data.type === "image") {
        return (
          <div className="flex  mb-2">
            <div
              className="rounded py-2 px-3 pl-4"
              style={{ backgroundColor: "#E2F7CB" }}
            >
              <img className="rounded lg:w-96 h-auto" src={data.content} />
              <p className="text-right text-xs text-gray-600 mt-1">
                {new Date(data.timeStamp).toLocaleString()}
              </p>
            </div>
          </div>
        );
      } else if (data.type === "text") {
        return renderFriendText(
          data.content,
          new Date(data.timeStamp).toLocaleString()
        );
      }
    }
  };

  const uploadFiles = (files) => {
    if (files.length > 0) {
      var reader = new FileReader();
      reader.readAsDataURL(files[0]); // convert to base64 string
      reader.onload = (e) => {
        console.log(e.target.result);
        fetch(e.target.result)
          .then((res) => res.blob())
          .then((blob) => {
            firebaseStorageRef()
              .child(`chats/${props.currentChat.chatId}/${files[0].name}`)
              .put(blob)
              .then((snapshot) => {
                snapshot.ref.getDownloadURL().then((res) => {
                  fireStoreRef()
                    .collection("chats")
                    .doc(props.currentChat.chatId)
                    .update({
                      messages: [
                        ...chatData.messages,
                        {
                          authorId: props.auth.uid,
                          type: files[0].type.split("/")[0],
                          content: res,
                          timeStamp: Date.now(),
                        },
                      ],
                    });
                });
              });
          });
      };
    }
  };

  return (
    <div className="w-full h-full flex flex-col border border-gray-200">
      {props.currentChat !== null ? (
        <>
          <div className="flex items-center w-full bg-gray-100 px-4 py-3">
            <img
              className="w-10 h-10 rounded-full"
              src={
                props.friendInfo?.photoUrl.length > 0
                  ? props?.friendInfo?.photoUrl
                  : profilePlaceholder
              }
              onClick={() => setShowProfile(true)}
            />
            <div
              className="font-semibold ml-4 mr-auto"
              onClick={() => setShowProfile(true)}
            >
              {props?.friendInfo?.name}
            </div>
          </div>
          <div
            className="bg-whatsapp bg-opacity-25 w-full flex flex-col px-4 py-4 justify-end"
            style={{
              height: "100%",
              overflowY: "scroll",
            }}
          >
            {renderChats(chatData?.messages)}
          </div>
          <div className="bg-white w-full h-16 flex items-center py-2 px-2">
            <input
              type="file"
              id="chatFileInput"
              onChange={(e) => {
                console.log(e.target.files);
                uploadFiles(e.target.files);
              }}
              className="hidden"
            />
            <label htmlFor="chatFileInput" className="mx-4">
              <img src={fileInputSvg} alt="upload" />
            </label>
            <input
              className="rounded w-full h-full border border-gray-300 outline-none px-4"
              placeholder="Enter your message"
              onChange={(e) => setText(e.target.value)}
              value={text}
              onKeyPress={(e) => {
                if (e.key === "Enter" && text.length > 0) {
                  sendText(text);
                }
              }}
            />
            <button
              className="px-3 bg-green-500 rounded h-full text-white ml-4"
              onClick={() => sendText(text)}
            >
              Send
            </button>
          </div>
          {showProfile ? (
            <div className="absolute top-0 right-0 z-30 bg-gray-600 bg-opacity-30 w-screen h-screen flex items-center justify-center">
              <div className="lg:w-96 bg-white flex flex-col items-center px-4 py-4">
                <img
                  className="lg:w-28 lg:h-28 rounded-full mt-8 mb-4 object-cover"
                  src={props.friendInfo.photoUrl}
                />
                <div className="flex flex-col w-full ">
                  <div className="w-full px-3 mb-4">
                    <label for="" className="text-xs font-semibold px-1">
                      Name
                    </label>
                    <div className="flex">{props.friendInfo.name}</div>
                  </div>
                  <div className="w-full px-3 mb-4">
                    <label for="" className="text-xs font-semibold px-1">
                      Email
                    </label>
                    <div className="flex">{props.friendInfo.email}</div>
                  </div>
                  <div className="w-full px-3 mb-4">
                    <label for="" className="text-xs font-semibold px-1">
                      Status
                    </label>
                    <div className="flex">{props.friendInfo.status}</div>
                  </div>
                </div>
                <div className="px-3 w-full mt-4">
                  <button
                    className="px-3 py-3 bg-green-500 hover:bg-green-600 rounded font-bold text-white w-full"
                    onClick={() => setShowProfile(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <div className="m-auto">
          <h1 className="text-2xl font-bold">Getting Started...</h1>
          <ul>
            <li>
              1. Click on contacts icon (if you are not on contacts page in
              sidebar)
            </li>
            <li>2. Click on add new contact</li>
            <li>
              3. Enter email which you want to add in contacts and click on
              search
            </li>
            <li>4. Click on Add button</li>
            <li>5. Click on contacts list to start messaging</li>
            <li>
              6. Here are some of test emails => test@test.com,
              drake07martinez@gmail.com
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
