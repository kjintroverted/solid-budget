import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import rdf from 'rdflib';

const VCARD = rdf.Namespace("http://www.w3.org/2006/vcard/ns#")

const Profile = ({ userID }) => {

  let [user, setUser] = useState();
  const store = new rdf.IndexedFormula;

  const getField = async (userStore, doc, field) => {
    const fetcher = new rdf.Fetcher(store);
    await fetcher.load(doc);
    return store.any(userStore, VCARD(field));
  }

  // GET USER STORE ON LOAD
  useEffect(() => {
    (async function loadUser() {
      const userStore = store.sym(userID);
      const profile = userStore.doc();
      const name = await getField(userStore, profile, "fn");
      setUser(name.value)
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