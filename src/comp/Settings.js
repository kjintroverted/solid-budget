import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import ProfileForm from './forms/ProfileForm';
import { TextField } from '@material-ui/core';
import { loadFile, saveFile } from '../util/pods';

const Settings = ({ userID }) => {

  let [settings, updateSettings] = useState(null);
  let [homepage, setHomepage] = useState();

  async function load(user) {
    const root = "https://" + user.split("/")[2] + "/public";
    setHomepage(root);

    let data = await loadFile(root + '/munny/settings.json', {});
    updateSettings(data);
  }

  function setValue(field) {
    return event => {
      updateSettings({ ...settings, [field]: event.target.value })
    }
  }

  useEffect(() => {
    if (userID) load(userID);
  }, [userID])

  useEffect(() => {
    if (settings) saveFile(homepage + '/munny/settings.json', settings);
  }, [settings]);

  if (!userID) return <></>;

  return (
    <ProfileView>
      <h2>Settings</h2>
      <ProfileForm field="name" userID={ userID } />
      { settings &&
        <>
          <TextField variant="outlined" label="Paycheck" type="number"
            value={ settings.paycheck || 0 }
            onChange={ setValue('paycheck') } />
          <TextField variant="outlined" label="Past Pay Date" type="date"
            style={ { marginTop: '10px' } }
            value={ settings.payDate || "2019-01-01" }
            onChange={ setValue('payDate') } />
        </>
      }
    </ProfileView>
  )
}

export default Settings;

const ProfileView = styled.div`
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              padding-left: 15px;
              width: 100vw;
              max-width: 500px;
`