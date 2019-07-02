import React from 'react';
import styled from 'styled-components';

import SimpleForm from './SimpleForm';

const Profile = ({ userID }) => {

  return (
    <ProfileView>
      <SimpleForm field="name" userID={ userID } />
    </ProfileView>
  )
}

export default Profile;

const ProfileView = styled.div`
          display: flex;
          flex-direction: column;

`