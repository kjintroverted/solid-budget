import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { getField, setField } from '../util/pods'

const Profile = ({ userID }) => {

  let [user, setUser] = useState();

  let updateName = async (event, value) => {
    event.preventDefault();
    console.log("setting name", value);
    await setField(userID, "fn", value);
    setUser(value);
  }

  // GET USER STORE ON LOAD
  useEffect(() => {
    (async function loadUser() {
      const name = await getField(userID, "fn");
      setUser(name.value);
    }())
  }, []);

  let input;
  return (
    <ProfileView>
      <form onSubmit={ e => updateName(e, input.value) }>
        <input ref={ ref => input = ref } defaultValue={ user } />
      </form>
    </ProfileView>
  )
}

export default Profile;

const ProfileView = styled.div`
          display: flex;
          flex-direction: column;
`