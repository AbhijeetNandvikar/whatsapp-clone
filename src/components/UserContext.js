import React from "react";
import { checkFirebaseAuth, fireStoreRef } from "../firebase";
import { useHistory } from "react-router-dom";
import firebase from "firebase";

export const globalStore = React.createContext(null);

export const UserContext = (props) => {
  const [auth, setAuth] = React.useState(null);
  let history = useHistory();
  console.log(history);
  const redirect = (location) => {
    history.push(location);
  };
  const reject = () => {
    setAuth(null);
    // redirect("login");
  };
  const resolve = (data) => {
    console.log(data);
    fireStoreRef()
      .collection("users")
      .doc(data.uid)
      .onSnapshot((doc) => {
        console.log(doc.exists);
        if (doc.exists) {
          setAuth(doc.data());
        } else {
          let userData = {
            name: data.displayName,
            email: data.email,
            photoUrl: data.photoURL,
            emailVerified: data.emailVerified,
            uid: data.uid,
            contacts: [],
            chats: [],
            status: "Hi, there nice too meet you!",
          };
          setAuth(userData);
          fireStoreRef()
            .collection("users")
            .doc(data.uid)
            .set(userData)
            .then((res) => {
              console.log("new user data added to db");
            })
            .catch((err) => console.log(err));
        }
      });

    // redirect("/feed");
  };
  console.log(auth);
  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log("user signed in");
        resolve(firebase.auth().currentUser);
      } else {
        reject();
        console.log("user logged out");
      }
    });
  }, []);

  return (
    <globalStore.Provider value={{ auth, setAuth }}>
      {props.children}
    </globalStore.Provider>
  );
};
