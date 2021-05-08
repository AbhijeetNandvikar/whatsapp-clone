import React, { useContext } from "react";
import { checkFirebaseAuth } from "../firebase";
import { globalStore } from "./UserContext";
import { Route, Switch, useLocation } from "react-router";
import ChatWindow from "./ChatWindow";
import ContactsArea from "./ContactsArea";
const MainApp = () => {
  const { auth } = useContext(globalStore);
  return (
    <div className="h-screen flex-col flex items-center justify-center p-9  ">
      <div className="lg:h-80 w-full bg-green-700 absolute z-0 top-0"></div>
      <div className="lg:w-3/4 lg:h-full bg-gray-100 z-20 flex">
        <ContactsArea />
        <ChatWindow />
      </div>
    </div>
  );
};

export default MainApp;
