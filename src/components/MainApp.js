import React, { useContext } from "react";
import { checkFirebaseAuth } from "../firebase";
import { globalStore } from "./UserContext";
import { Route, Switch, useLocation } from "react-router";
const MainApp = () => {
  const { auth } = useContext(globalStore);
  return (
    <div className="h-screen flex-col flex">
      <div className=" bg-gray-50 pt-8 h-full"></div>
    </div>
  );
};

export default MainApp;
