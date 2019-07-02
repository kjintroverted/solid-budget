import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import auth from 'solid-auth-client';

import './App.css';
import HeaderNav from './comp/Header';
import Settings from './comp/Settings';

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
        { user && <Settings userID={ user } /> }
      </Content>
    </div>
  );
}

export default App;

const Content = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 60px;
`