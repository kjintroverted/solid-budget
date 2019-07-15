import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { setField, getField } from '../../util/pods';

const ProfileForm = ({ userID, field }) => {
  let [value, setValue] = useState();

  let updateField = async (event, value) => {
    event.preventDefault();
    console.log("setting", field, value);
    await setField(userID, field, value);
    setValue(value);
  }

  // GET USER STORE ON LOAD
  useEffect(() => {
    (async function loadUser() {
      const rec = await getField(userID, field);
      if (rec) setValue(rec.value);
      else setValue("")
    }())
  }, []);

  return (
    <form onSubmit={ e => updateField(e, value) }>
      <TextField
        variant="outlined"
        id={ field }
        label={ field }
        value={ value || "" }
        onChange={ e => setValue(e.target.value) }
        margin="normal"
      />
    </form>
  )
}

export default ProfileForm;
