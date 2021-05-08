import firebase from "firebase";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCcBbbWmvNRjOKYDui_-AqzfaxJXxQUqmw",
  authDomain: "whatsapp-clone-8e0c6.firebaseapp.com",
  projectId: "whatsapp-clone-8e0c6",
  storageBucket: "whatsapp-clone-8e0c6.appspot.com",
  messagingSenderId: "95029750629",
  appId: "1:95029750629:web:bb5533a849950626490f8c",
  measurementId: "G-8HQ7NDRW05",
};

export const initFirebase = (firebaseConfig, resolve, reject) => {
  const firebaseApp = firebase.initializeApp(firebaseConfig);
};

export const signUpWrapper = (email, pass, resolve, reject) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, pass)
    .then((res) => {
      console.log(res);
      // store.dispatch(userLogin(firebase.auth().currentUser));
      // if (typeof resolve === "function") resolve();
    })
    .catch((res) => {
      console.log(res);
      // if (typeof reject === "function") reject(res.code);
    });
};

export const loginWrapper = (email, pass, resolve, reject) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, pass)
    .then((res) => {
      console.log(res);
      // store.dispatch(userLogin(firebase.auth().currentUser));
      // if (typeof resolve === "function") resolve();
    })
    .catch((res) => {
      console.log(res);
      if (typeof reject === "function") reject(res);
    });
};

export const logoutWrapper = () => {
  firebase
    .auth()
    .signOut()
    .then((res) => {
      console.log(res);
      // store.dispatch(userLogout(res.user));
    })
    .catch((res) => {
      console.log(res);
    });
  // window.location.href = "http://localhost:3000";
};

export const googlesigninwrapper = () => {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      var credential = result.credential;

      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = credential.accessToken;
      // The signed-in user info.
      var user = result.user;
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  // firebase
  //   .auth()
  //   .signInWithPopup(provider)
  //   .then((result) => {

  //     // store.dispatch(userLogin(user));
  //   })
  //   .catch((error) => {
  //     // var errorCode = error.code;
  //     // var errorMessage = error.message;
  //     // // The email of the user's account used.
  //     // var email = error.email;
  //     // // The firebase.auth.AuthCredential type that was used.
  //     // var credential = error.credential;
  //     console.log(error);
  //   });
};

export const checkFirebaseAuth = () => firebase.auth().currentUser;
export const firebaseStorageRef = () => firebase.storage().ref();

export const fireStoreRef = () => firebase.firestore();
