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
    redirect("login");
  };
  const resolve = (data) => {
    console.log(data);
    fireStoreRef()
      .collection("users")
      .doc(data.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setAuth(doc.data());
        } else {
          setAuth({
            name: data.displayName,
            email: data.email,
            photoUrl: data.photoURL,
            emailVerified: data.emailVerified,
            uid: data.uid,
            images: data?.images?.length ? data.images : [],
            bio: data.bio ? data.bio : "",
          });
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
        // No user is signed in
        reject();
        console.log("user logged out");
      }
    });
  }, []);

  React.useEffect(() => {
    if (auth !== null) {
      fireStoreRef()
        .collection("user")
        .doc(auth.uid)
        .onSnapshot((doc) => {
          setAuth(doc.data());
        });
    }
  }, []);

  return (
    <globalStore.Provider value={{ auth, setAuth }}>
      {props.children}
    </globalStore.Provider>
  );
};
