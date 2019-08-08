import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';

import './App.css';
import HeaderNav from './comp/Header';
import Settings from './comp/Settings';
import Dashboard from './comp/Dashboard';
import { theme } from './comp/theme/Provider';
import AddPayment from './comp/api/AddPayment';

const solidClient = require('solid-file-client');

function App() {

  let [user, setUser] = useState(null);

  async function getCurrentUser() {
    let session;
    try {
      session = await solidClient.checkSession()
    } catch {
      console.log("No current session.");
    }
    setUser(!session ? null : session.webId);
  }

  async function login() {
    let webId
    try {
      ({ webId } = await solidClient.checkSession());
    } catch {
      webId = await solidClient.popupLogin();
    }
    console.info("Welcome,", webId);
    setUser(webId)
  }

  async function logout() {
    await solidClient.logout();
    setUser(null);
  }

  useEffect(() => {
    if (!user) login()
  }, [user])

  useEffect(getCurrentUser, []);

  return (
    <Router>
      <ThemeProvider theme={ theme }>
        <div className="App">
          <HeaderNav userID={ user } logout={ logout } login={ login } />
          <Content>
            <Route path="/" exact render={ () => <Dashboard userID={ user } /> } />
            <Route path="/settings/" render={ () => <Settings userID={ user } /> } />
            <Route path="/api/payment/" component={ AddPayment } />
          </Content>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;

const Content = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 80px;
        margin-bottom: 20px;
        padding: 0px 5px;
`