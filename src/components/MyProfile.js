import React, { useContext, useEffect, useState } from "react";
import { globalStore } from "./UserContext";
import profilePlaceholder from "../images/profilePlaceholder.png";
import { firebaseStorageRef, fireStoreRef } from "../firebase";

const MyProfile = (props) => {
  const { auth, setAuth } = useContext(globalStore);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState("");

  const readFile = (e) => {
    console.log(e.target.files);
    if (e.target.files && e.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]); // convert to base64 string
      reader.onload = (e) => {
        setImage(e.target.result);
        console.log(e.target.result);
      };
    }
  };
  useEffect(() => {
    if (auth !== null) {
      setName(auth.name);
      setStatus(auth.status);
      setImage(
        auth?.photoUrl?.length > 0 ? auth?.photoUrl : profilePlaceholder
      );
    }
  }, [auth]);

  const saveChanges = () => {
    console.log(image);
    if (auth.photoUrl !== image) {
      fetch(image)
        .then((res) => res.blob())
        .then((blob) => {
          console.log(blob);
          startUpload(blob).then((snapshot) => {
            snapshot.ref.getDownloadURL().then((res) => {
              fireStoreRef().collection("users").doc(auth.uid).update({
                name: name,
                status: status,
                photoUrl: res,
              });
            });
          });
        });
    } else {
      fireStoreRef().collection("users").doc(auth.uid).update({
        name: name,
        status: status,
      });
    }
  };

  const startUpload = (image) => {
    return firebaseStorageRef().child(`${auth.uid}/profileImage`).put(image);
  };
  return (
    <div className="w-full flex flex-col items-center px-4">
      <img
        className="lg:w-28 lg:h-28 rounded-full mt-8 mb-4 object-cover"
        src={image}
      />
      <input
        type="file"
        id="uploadImage"
        className="hidden"
        onChange={(e) => readFile(e)}
      />
      <label
        htmlFor="uploadImage"
        className="px-3 py-2 font-bold border-2 border-green-500 text-green-500 mx-auto rounded"
      >
        Add new image
      </label>
      <div className="flex flex-col w-full ">
        <div className="w-full px-3 mb-4">
          <label for="" className="text-xs font-semibold px-1">
            Name
          </label>
          <div className="flex">
            <input
              type="text"
              className="w-full px-3 py-2 rounded border-2 border-gray-200 outline-none focus:border-green-500"
              placeholder="Enter your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full px-3 mb-4">
          <label for="" className="text-xs font-semibold px-1">
            Status
          </label>
          <div className="flex">
            <input
              type="text"
              className="w-full px-3 py-2 rounded border-2 border-gray-200 outline-none focus:border-green-500"
              placeholder="Enter your current status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="px-3 w-full mt-4">
        <button
          className="px-3 py-3 bg-green-500 hover:bg-green-600 rounded font-bold text-white w-full"
          onClick={() => saveChanges()}
        >
          Save changes
        </button>
      </div>
    </div>
  );
};

export default MyProfile;
