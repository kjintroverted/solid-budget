import React from 'react';
import { Button, IconButton, Input, InputAdornment } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import profileStruct from "../models/profile";
import { addToUpdateQueue, SaveState, setAttr } from "solid-core";
import { BigBar, BigIconHeader, Column, SaveButton, Spacer } from "./styled";


function Profile({ profile, onChange }) {

  const [edit, toggleEdit] = useState(false);
  const [thing, setThing] = useState();
  const { queue, saveFromQ, updateQueue } = useContext(SaveState)

  useEffect(() => {
    if (!profile) return
    setThing(profile.thing)
  }, [profile])

  function update(field) {
    return ({ target }) => {
      onChange({ ...profile, [field]: target.value })
      let t = setAttr(thing, profileStruct[field], target.value);
      updateQueue(addToUpdateQueue(queue, t))
      setThing(t)
    }
  }

  function updateName({ target }) {
    let [firstName = '', lastName = ''] = target.value.split(' ');
    onChange({ ...profile, firstName, lastName });
    let t = setAttr(thing, profileStruct['firstName'], firstName)
    t = setAttr(t, profileStruct['lastName'], lastName)
    setThing(t)
    updateQueue(addToUpdateQueue(queue, t))
  }

  if (!profile) return <></>

  return (
    <>
      <BigBar>
        <BigIconHeader className="material-icons">account_circle</BigIconHeader>
        <Column justify="center">
          { !edit ?
            <h2 style={ { margin: 0 } }>
              { profile.firstName } { profile.lastName }
              <span className="material-icons" onClick={ () => toggleEdit(!edit) }>edit</span>
            </h2>
            : <Input
              type="text"
              placeholder="name"
              defaultValue={ profile.firstName ? `${ profile.firstName } ${ profile.lastName }` : "" }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={ () => toggleEdit(!edit) } color="inherit">
                    <span className="material-icons">done</span>
                  </IconButton>
                </InputAdornment>
              }
              onChange={ updateName } />
          }
          <p>{ profile.nickname }</p>
        </Column>
        <Spacer />
        <Column justify="flex-end">
          {/* <IconButton color="inherit" href="https://kitchen.wkgreen.dev">
            <span className="material-icons large">kitchen</span>
          </IconButton> */}
          <Link to="/">
            <IconButton color="inherit">
              <span className="material-icons large">request_quote</span>
            </IconButton>
          </Link>
        </Column>
      </BigBar>
      <Column align="center">
        <Input
          type="text"
          placeholder="nickname"
          defaultValue={ profile.nickname || "" }
          startAdornment={
            <InputAdornment position="start">
              <span className="material-icons">account_circle</span>
            </InputAdornment>
          }
          onChange={ update("nickname") } />
        <Input
          type="text"
          placeholder="email"
          defaultValue={ profile.email || "" }
          startAdornment={
            <InputAdornment position="start">
              <span className="material-icons">email</span>
            </InputAdornment>
          }
          onChange={ update("email") } />
        {
          !!queue.length &&
          <SaveButton>
            <Button
              variant="contained"
              color="secondary"
              onClick={ saveFromQ }>
              Save
            </Button>
          </SaveButton>
        }
      </Column>
    </>)
}

export default Profile;