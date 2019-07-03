import React from 'react';
import styled from 'styled-components';

import SimpleForm from './SimpleForm';

const Settings = ({ userID }) => {

  if (!userID) return <></>;

  return (
    <ProfileView>
      <h2>Settings</h2>
      <SimpleForm field="name" userID={ userID } />
    </ProfileView>
  )
}

export default Settings;

const ProfileView = styled.div`
              display: flex;
              flex-direction: column;
              padding-left: 15px;
              width: 100vw;
              max-width: 500px;
`