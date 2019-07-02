import React, { useState, useEffect } from 'react';
import { setField, getField } from '../util/pods';

const SimpleForm = ({ userID, field }) => {
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

  let input;

  return (
    <form onSubmit={ e => updateField(e, input.value) }>
      <input ref={ ref => input = ref } defaultValue={ value } />
    </form>
  )
}

export default SimpleForm;
