import React, { useState, useContext } from "react";
import ActiveChats from "./ActiveChats";
import MyContacts from "./MyContacts";
import MyProfile from "./MyProfile";
import { globalStore } from "./UserContext";
import profilePlaceholder from "../images/profilePlaceholder.png";
import contactSvg from "../images/contactSvg.svg";

const ContactsArea = (props) => {
  const { auth, setAuth } = useContext(globalStore);

  const [currentPage, setCurrentPage] = useState("myContacts");
  const renderCurrentPage = (page) => {
    switch (page) {
      case "activeChats":
        return <ActiveChats />;
      case "myProfile":
        return <MyProfile />;
      case "myContacts":
        return <MyContacts setCurrentChat={props.setCurrentChat} />;
    }
  };
  return (
    <div className="lg:w-4/12 h-full bg-white border border-gray-200">
      <div className="bg-gray-100 flex w-full py-3 px-4 items-center">
        <img
          className="w-10 h-10 rounded-full mr-auto"
          src={auth?.photoUrl?.length > 0 ? auth.photoUrl : profilePlaceholder}
          alt="image"
          onClick={() => setCurrentPage("myProfile")}
        />
        <div className="w-8 h-8 flex">
          <img
            src={contactSvg}
            atl="contactSvg"
            onClick={() => setCurrentPage("myContacts")}
          />
        </div>
      </div>
      {renderCurrentPage(currentPage)}
    </div>
  );
};

export default ContactsArea;
