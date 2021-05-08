import React, { useContext, useEffect, useState } from "react";
import { checkFirebaseAuth, fireStoreRef } from "../firebase";
import { globalStore } from "./UserContext";
import { Route, Switch, useLocation } from "react-router";
import ChatWindow from "./ChatWindow";
import ContactsArea from "./ContactsArea";
const MainApp = () => {
  const { auth } = useContext(globalStore);
  const [currentChat, setCurrentChat] = useState(null);
  const [myChats, setMyChats] = useState([]);
  const [friendsInfo, setFriendsInfo] = useState(null);
  const fetchFriendsInfo = (idArray) => {
    return fireStoreRef().collection("users").where("uid", "in", idArray).get();
  };
  useEffect(() => {
    if (auth !== null) {
      const friendsIdArray = auth.chats.map((obj) => {
        return obj.uid;
      });
      if (friendsIdArray.length > 0) {
        fetchFriendsInfo(friendsIdArray).then((querySnapshot) => {
          const info = {};
          querySnapshot.forEach((doc) => {
            info[doc.data().uid] = doc.data();
          });
          setFriendsInfo(info);
        });
      }
    }
  }, [auth?.chats]);

  return (
    <div className="h-screen flex-col flex items-center justify-center p-9  ">
      <div className="lg:h-80 w-full bg-green-700 absolute z-0 top-0"></div>
      <div className="lg:w-3/4 lg:h-full bg-gray-100 z-20 flex">
        <ContactsArea
          friendsInfo={friendsInfo}
          setCurrentChat={(val) => setCurrentChat(val)}
        />
        <ChatWindow
          friendInfo={
            friendsInfo !== null ? friendsInfo[currentChat?.uid] : null
          }
          auth={auth}
          currentChat={currentChat}
        />
      </div>
    </div>
  );
};

export default MainApp;
