import logo from "./logo.svg";
import React from "react";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import MainApp from "./components/MainApp";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route path="/">
          <MainApp />
        </Route>
        <Route path="/profile/:id">
          <Redirect to="/profile/:id" />
        </Route>
        <Route path="/*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
