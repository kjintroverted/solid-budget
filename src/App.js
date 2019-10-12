import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import { withWebId } from "@inrupt/solid-react-components";

import "./App.css";
import HeaderNav from "./comp/Header";
import Dashboard from "./comp/Dashboard";
import Settings from "./comp/Settings";
import { theme } from "./comp/theme/Provider";
import { getAppStoragePath, unmarshal } from "./util/pods";

function App({ webId }) {

  const [loggedIn, setLoggedIn] = useState(false);
  const [storage, setStorage] = useState(null);
  const [settings, setSettings] = useState({});

  useEffect(() => setLoggedIn(!!webId), [webId])

  // LOAD NEW USER
  useEffect(() => {
    async function init() {
      const storage = await getAppStoragePath(webId);
      setStorage(storage);
    }
    if (webId) init(webId);
  }, [webId]);

  useEffect(() => {
    async function loadSettings() {
      const data = await unmarshal(`${ storage }data.ttl`)
      setSettings(data)
    }

    if (storage) loadSettings()
  }, [storage])

  return (
    <Router>
      <ThemeProvider theme={ theme }>
        <div className='App'>
          <HeaderNav onUpdate={ setLoggedIn } />
          <Content>
            <Route path='/' exact
              render={ () =>
                <Dashboard
                  auth={ loggedIn }
                  storage={ storage }
                  settings={ settings }
                /> }
            />
            <Route path='/settings' exact component={ Settings } />
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
