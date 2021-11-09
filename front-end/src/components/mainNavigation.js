import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';

import './mainNavigation.css'
import LoginContext from '../context/login-context';

const MainNavigation = props => (
  <LoginContext.Consumer>
    {context => {
      return (
        <header className="main-navigation">
          <nav className="main-navigation">
          <ul>
            {!context.token &&
            <li>
              <NavLink to="/signin">Login</NavLink>
            </li>
             }
            <li>
              <NavLink to="/event">Event</NavLink>
            </li>
          </ul>
        </nav>
        </header>
      );
    }}
  </LoginContext.Consumer>
);

export default MainNavigation;


