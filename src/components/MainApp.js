import React, { useContext, useEffect, useState } from "react";
import { checkFirebaseAuth, fireStoreRef } from "../firebase";
import { globalStore } from "./UserContext";
import { Route, Switch, useLocation } from "react-router";
import ChatWindow from "./ChatWindow";
import ContactsArea from "./ContactsArea";
const MainApp = () => {
  const { auth } = useContext(globalStore);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [myChats, setMyChats] = useState([]);
  const fetchFriendsInfo = (idArray) => {
    return fireStoreRef().collection("users").where("uid", "in", idArray).get();
  };
  useEffect(() => {
    if (auth !== null) {
      console.log(auth.chats);
      const friendsIdArray = auth.chats.map((obj) => {
        return obj.uid;
      });
      if (friendsIdArray.length > 0) {
        fetchFriendsInfo(friendsIdArray).then((querySnapshot) => {
          const chats = [];
          querySnapshot.forEach((doc) => {
            chats.push(doc.data());
          });
          console.log(chats);
        });
      }
    }
  }, [auth?.chats]);
  return (
    <div className="h-screen flex-col flex items-center justify-center p-9  ">
      <div className="lg:h-80 w-full bg-green-700 absolute z-0 top-0"></div>
      <div className="lg:w-3/4 lg:h-full bg-gray-100 z-20 flex">
        <ContactsArea setCurrentChatId={(val) => setCurrentChatId(val)} />
        <ChatWindow currentChatId={currentChatId} />
      </div>
    </div>
  );
};

export default MainApp;
