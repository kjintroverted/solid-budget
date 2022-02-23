import React from 'react';
import './App.css';
import {
  Main,
  appLogin,
  getDomain,
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
import { AppTheme, THEME } from './util';

const muiTheme = newTheme(THEME)

function App() {

  const [err, setError] = useState();
  const [dataset, setDataset] = useState();
  const [accounts, setAccounts] = useState();
  const [queue, updateQueue] = useState([]);
  // PROFILE STATE
  const [user, setUser] = useState();
  const [profile, setProfile] = useState();
  const [edit, toggleEdit] = useState(false);

  async function saveFromQ() {
    let res = await save(queue);
    setDataset(res);
    updateQueue([]);
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
        .then(setDataset);
    }
  }, [profile, user])

  return (
    <SaveState.Provider value={ {
      queue,
      updateQueue,
      saveFromQ,
      dataset,
      setDataset,
      accounts,
      setAccounts
    } }>
      <AppTheme.Provider value={ { ...THEME, mui } }>
        <mui.ThemeProvider theme={ muiTheme }>
          <Main>
            <Router>
              <Routes>
                <Route path="/" element={ <Dashboard user={ profile } /> } />
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
      </AppTheme.Provider>
    </SaveState.Provider>
  );
}

export default App;