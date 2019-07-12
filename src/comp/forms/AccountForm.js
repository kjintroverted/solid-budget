import React, { useState } from 'react';
import { TextField, Select, MenuItem, FormLabel, FormControl, OutlinedInput, IconButton, Fab } from '@material-ui/core';
import styled from 'styled-components';

export default ({ onSubmit }) => {

  let [account, setValues] = useState({});

  function handleChange(field) {
    return event => {
      setValues({ ...account, [field]: event.target.value })
    }
  }

  return (
    <Form onSubmit={ console.log }>
      <TextField
        variant="outlined"
        label="Name"
        onChange={ handleChange('name') } />

      <FormControl variant="outlined" style={ { minWidth: 120 } }>
        <FormLabel htmlFor="label">Label</FormLabel>
        <Select
          value={ account.label || "" }
          onChange={ handleChange('label') }
          input={ <OutlinedInput name="label" id="label" /> }
        >
          <MenuItem value={ 'Main' }>Main</MenuItem>
          <MenuItem value={ 'Checking' }>Checking</MenuItem>
          <MenuItem value={ 'Saving' }>Saving</MenuItem>
          <MenuItem value={ 'Interest' }>Interest Saving</MenuItem>
          <MenuItem value={ 'Personal' }>Personal</MenuItem>
          <MenuItem value={ 'Business' }>Business</MenuItem>
          <MenuItem value={ 'Buckets' }>Buckets</MenuItem>
        </Select>
      </FormControl>

      <TextField
        variant="outlined"
        type="number"
        label="Balance"
        onChange={ handleChange('balance') } />

      <IconButton onClick={ () => onSubmit(account) }>
        <i className="material-icons">check</i>
      </IconButton>
    </Form>
  )
}

const Form = styled.div`
    display: flex;
    margin: 10px;
    justify-content: space-between;
    align-items: flex-end;
`