import React, { useState } from 'react';
import "./App.css";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Modal from 'react-modal'

import Events from "./components/events";
import MainNavigation from "./components/mainNavigation";
import SignUp from "./components/signUp";
import SignIn from "./components/signIn";
import LoginContext from "./context/login-context";
Modal.setAppElement('#root');

function App() {
const [token,setToken] = useState(null);
const [userId,setUserId] = useState(null);

const login = (token,userId,tokenExpiration) =>{
  setToken(token);
  setUserId(userId);
}

const logout = () => {
  setToken(null);
  setUserId(null);
}
  return (
    <div className="App">
      <BrowserRouter>
      <LoginContext.Provider value={{
        token : token,
        userId : userId,
        login : login,
        logout : logout
      }}>
        <>
          <div className="title">
            <h1> EventApp </h1>
            <MainNavigation />
          </div>
          <main>
            <Switch>
              {!token && <Redirect path="/" to="/signin" exact />}
              {token && <Redirect path="/signin" to="/event" exact />}
              {token && <Redirect path="/signin" to="/event" exact />}
              <Route path="/signin" component={SignIn} />
              <Route path="/signup" component={SignUp} />
              <Route path="/event" component={Events} /> <Events />
            </Switch>
          </main>
        </>
        </LoginContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
