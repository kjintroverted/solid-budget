import React from 'react';
import './App.css';
import {
  Main,
  muiTheme,
  appLogin,
  getDomain,
  getThings,
  loadDataset,
  loadThing,
  save,
  SaveState,
  Profile,
  profileStruct
} from 'solid-core';
import { useEffect, useState } from 'react';
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import * as mui from '@material-ui/core';

function App() {

  const [user, setUser] = useState();
  const [things, setThings] = useState();
  const [queue, updateQueue] = useState([]);
  // PROFILE STATE
  const [profile, setProfile] = useState();
  const [edit, toggleEdit] = useState(false);

  async function saveFromQ() {
    await save(queue);
    updateQueue([])
  }

  useEffect(() => {
    const session = getDefaultSession();
    session.handleIncomingRedirect()
      .then(info => {
        if (info.isLoggedIn) setUser(info.webId)
        else appLogin()
      })
  }, [])

  // USER LOADED => LOAD DATA
  useEffect(() => {
    if (user) {
      // LOAD PROFILE
      loadThing(user, profileStruct)
        .then(setProfile)
      // LOAD COOKBOOK DATASET
      loadDataset(getDomain(user) + "/kitchen")
        .then(data => {
          setThings(getThings(data))
        });
    }
  }, [user])

  return (
    <SaveState.Provider value={ { queue, updateQueue, saveFromQ } }>
      <mui.ThemeProvider theme={ muiTheme }>
        <Main>
          <Router>
            <Routes>
              <Route path="/"
                element={
                  <SaveState.Consumer>
                    {
                      saveState => (
                        <Profile
                          profile={ profile }
                          edit={ edit }
                          toggleEdit={ toggleEdit }
                          ui={ mui }
                          saveState={ saveState }
                          onChange={ setProfile }
                        />
                      )
                    }
                  </SaveState.Consumer>
                } />
            </Routes>
          </Router>
        </Main>
      </mui.ThemeProvider>
    </SaveState.Provider>
  );
}

export default App;