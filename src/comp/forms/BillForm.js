import React, { useState } from 'react';
import { TextField, IconButton, FormControl, FormHelperText } from '@material-ui/core';
import styled from 'styled-components';

export default ({ onSubmit }) => {

  let [bill, setValues] = useState({});
  let [error, setError] = useState(null);

  function handleChange(field) {
    return event => {
      let val = event.target.value;
      if (field === 'date') {
        if (val > 28) {
          setError("Must be less than 28")
          return;
        }
        if (val < 1) {
          setError("Must be greater than 1")
          return;
        }
      }
      setError("")
      setValues({ ...bill, [field]: val })
    }
  }

  return (
    <Form onSubmit={ console.log }>
      <TextField
        variant="outlined"
        label="Title"
        onChange={ handleChange('title') } />

      <TextField
        variant="outlined"
        type="number"
        label="Payment"
        onChange={ handleChange('payment') } />

      <FormControl error={ !!error }>
        <TextField
          variant="outlined"
          type="number"
          label="Date"
          onChange={ handleChange('date') } />
        <FormHelperText>{ error }</FormHelperText>
      </FormControl>

      <IconButton onClick={ () => onSubmit(bill) }>
        <i className="material-icons">check</i>
      </IconButton>
    </Form>
  )
}

const Form = styled.div`
    display: flex;
    margin: 10px;
    justify-content: space-between;
    align-items: flex-start;
`