import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { getField } from '../util/pods'

const Profile = ({ userID }) => {

  let [user, setUser] = useState();

  // GET USER STORE ON LOAD
  useEffect(() => {
    (async function loadUser() {
      const name = await getField(userID, "fn");
      setUser(name.value);
    }())
  }, []);

  return (
    <ProfileView>
      <h1>{ user }</h1>
      <p>{ userID }</p>
    </ProfileView>
  )
}

export default Profile;

const ProfileView = styled.div`
      display: flex;
      flex-direction: column;
`