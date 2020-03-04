import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import { withWebId } from "@inrupt/solid-react-components";

import "./App.css";
import HeaderNav from "./components/Header";
import { theme } from "./components/theme/Provider";
import Dashboard from "./containers/Dashboard";
import Settings from "./containers/Settings";
import { getAppStoragePath, unmarshal, saveOne, logout } from "./util/pods";
import settingsShape from './contexts/settings-shape';

// 2 DAYS
const timeout = 86400000 * 2;


function App({ webId }) {

  const [loggedIn, setLoggedIn] = useState(false);
  const [storage, setStorage] = useState(null);
  const [settings, setSettings] = useState({});

  async function saveSettings(data) {
    setSettings(data);
    await saveOne(settingsShape, data, `${ storage }data.ttl`)
    console.log("Preferences saved.");
  }

  // LOAD NEW USER
  useEffect(() => {
    async function init() {
      const storage = await getAppStoragePath(webId);
      setStorage(storage);
    }
    if (webId) {
      init(webId);
      // CHECK FOR STALE AUTH
      let timestamp = localStorage.getItem("lastLogin")
      if (!timestamp) {
        localStorage.setItem("lastLogin", JSON.stringify(new Date()))
      } else if ((new Date() - new Date(JSON.parse(timestamp))) > timeout) { // LAST LOGIN IS GREATER THAN 2 DAYS AGO
        logout()
        return
      }
      setLoggedIn(true)
      return
    }
    setLoggedIn(false)
  }, [webId]);

  // LOAD STORAGE
  useEffect(() => {
    async function loadSettings() {
      const data = await unmarshal(`${ storage }data.ttl`, settingsShape);
      setSettings(data)
    }

    if (storage) loadSettings()
  }, [storage])

  return (
    <Router>
      <ThemeProvider theme={ theme }>
        <div className='App'>
          <HeaderNav loggedIn={ loggedIn } onUpdate={ setLoggedIn } />
          <Content>
            <Route path='/' exact
              render={ () =>
                <Dashboard
                  auth={ loggedIn }
                  storage={ storage }
                  settings={ settings }
                /> }
            />
            <Route path='/settings' exact
              render={ () =>
                <Settings
                  settings={ settings }
                  onUpdate={ saveSettings }
                /> }
            />
          </Content>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default withWebId(App);

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
  margin-bottom: 20px;
  padding: 0px 5px;
`;
