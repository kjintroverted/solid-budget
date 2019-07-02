import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import auth from 'solid-auth-client';

import './App.css';
import HeaderNav from './comp/Header';
import Profile from './comp/Profile';

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
    <div className="App">
      <HeaderNav userID={ user } logout={ logout } />
      <Content>
        { user && <Profile userID={ user } /> }
      </Content>
    </div>
  );
}

export default App;

const Content = styled.div`
        margin-top: 60px;
`