import React from 'react';
import './App.css';
import {
  Main,
  appLogin,
  getDomain,
  getThings,
  loadDataset,
  loadThing,
  save,
  SaveState,
  Profile,
  profileStruct,
  newTheme
} from 'solid-core';
import { useEffect, useState } from 'react';
import { handleIncomingRedirect, getDefaultSession } from '@inrupt/solid-client-authn-browser';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import * as mui from '@material-ui/core';
import Dashboard from './components/Dashboard';

// https://poolors.com/4c1e81-0787a2-795a3f-e6cad4
export const THEME = {
  light: '#e6cad4',
  dark: '#795a3f',
  primary: '#4c1e81',
  secondary: '#0787a2'
}

const muiTheme = newTheme(THEME)

function App() {

  const [err, setError] = useState();
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
    const getUser = async function () {
      await handleIncomingRedirect()
      let { info } = getDefaultSession()
      if (info.isLoggedIn) setUser(info.webId)
      else appLogin()
    }
    getUser()
  }, [err])

  // USER LOADED => GET SESSION
  useEffect(() => {
    if (user) {
      // LOAD PROFILE
      loadThing(user, profileStruct)
        .then(res => {
          if (res instanceof Error) {
            console.error(res)
            setError(res)
          }
          else setProfile(res)
        })
    }
  }, [user])

  // SESSION CONFIRMED => GET DATA
  useEffect(() => {
    if (profile) {
      // LOAD BUDGET DATASET
      loadDataset(getDomain(user) + "/budget")
        .then(data => {
          setThings(getThings(data))
        });
    }
  }, [profile, user])

  return (
    <SaveState.Provider value={ { queue, updateQueue, saveFromQ } }>
      <mui.ThemeProvider theme={ muiTheme }>
        <Main>
          <Router>
            <Routes>
              <Route path="/" element={ <Dashboard data={ things } /> } />
              <Route path="/profile"
                element={
                  <SaveState.Consumer>
                    {
                      saveState => (
                        <Profile
                          profile={ profile }
                          edit={ edit }
                          toggleEdit={ toggleEdit }
                          ui={ mui }
                          theme={ THEME }
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