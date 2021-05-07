import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UserContext } from "./components/UserContext";
import { BrowserRouter as Router } from "react-router-dom";
import { firebaseConfig, initFirebase } from "./firebase";
initFirebase(firebaseConfig);

ReactDOM.render(
  <Router>
    <UserContext>
      <App />
    </UserContext>
  </Router>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
