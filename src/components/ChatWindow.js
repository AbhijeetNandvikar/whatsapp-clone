import React, { useEffect } from "react";
import { fireStoreRef } from "../firebase";

const ChatWindow = (props) => {
  useEffect(() => {
    if (props.currentChatId !== null) {
      // fireStoreRef().collection('chats').doc(props.currentChatId).onSnapshot(snapShot=>{
      // })
    }
  }, [props]);
  return <div></div>;
};

export default ChatWindow;
