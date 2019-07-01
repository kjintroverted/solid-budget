import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import auth from 'solid-auth-client';

import './App.css';

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

  useEffect(() => {
    if (!user) login()
  }, [user])

  return (
    <div className="App">
      <Header>
        <h3>Munny Pouch</h3>
        <span className="spacer" />
        <i className="material-icons click">person</i>
      </Header>
      { user && <p>Welcome { user }</p> }
    </div>
  );
}

export default App;

const Header = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 50px;
  width: 100vw;
  display: flex;
  align-items: center;
  color: #fff;
  background: navy;
  box-shadow: gray 1px 1px 5px;

  & * {
    margin: 0px 10px;
  }
`