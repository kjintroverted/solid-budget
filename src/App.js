import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import auth from 'solid-auth-client';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.css';
import HeaderNav from './comp/Header';
import Settings from './comp/Settings';
import Dashboard from './comp/Dashboard';

function App() {

  let [user, setUser] = useState();

  async function login() {
    let session = await auth.currentSession();
    let popupUri = 'https://solid.community/common/popup.html';
    if (!session)
      session = await auth.popupLogin({ popupUri });
    console.info("Welcome,", session.webId);
    setUser(session.webId)
  }

  async function logout() {
    await auth.logout();
    setUser(null);
  }

  useEffect(() => {
    if (!user) login()
  }, [user])

  return (
    <Router>
      <div className="App">
        <HeaderNav userID={ user } logout={ logout } login={ login } />
        <Content>
          <Route path="/" exact render={ () => <Dashboard userID={ user } /> } />
          <Route path="/settings/" render={ () => <Settings userID={ user } /> } />
        </Content>
      </div>
    </Router>
  );
}

export default App;

const Content = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 60px;
`