import React, { useState, useEffect } from 'react';
import { TextField, IconButton, FormControl, FormHelperText, FormControlLabel, Checkbox } from '@material-ui/core';
import styled from 'styled-components';

export default ({ onSubmit }) => {

  let [bill, setValues] = useState({});
  let [error, setError] = useState(null);
  let [monthly, setMonthly] = useState(true);

  function handleChange(field, numeric) {
    return event => {
      let val = numeric ? +event.target.value : event.target.value;
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

  function toggle(e) {
    let monthArr = bill.months || [];
    let { value } = e.target;
    value = +value;
    let i = monthArr.indexOf(value);

    if (i >= 0) {
      monthArr = [...monthArr.slice(0, i), ...monthArr.slice(i + 1)];
      setValues({ ...bill, months: monthArr });
      return;
    }
    setValues({ ...bill, months: [...monthArr, value] });
  }

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={ monthly }
            onChange={ e => {
              if (e.target.checked) setValues({ ...bill, months: null })
              setMonthly(e.target.checked)
            } }
            color="primary"
          />
        }
        label="Monthly Payment"
      />
      <Form>
        <TextField
          variant="outlined"
          label="Title"
          onChange={ handleChange('title') } />

        <TextField
          variant="outlined"
          type="number"
          label="Payment"
          onChange={ handleChange('payment', true) } />

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
      { !monthly &&
        <>
          <p>Occurs in these months:</p>
          <FormGroup>
            { months.map((name, i) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={ bill.months && bill.months.indexOf(i + 1) != -1 }
                    value={ i + 1 }
                    onChange={ toggle }
                    color="primary"
                  />
                }
                label={ name }
              />
            )) }
          </FormGroup>
        </>
      }
    </>
  )
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

const Form = styled.div`
    display: flex;
    margin-top: 10px;
    justify-content: space-between;
    align-items: flex-start;
`

const FormGroup = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, 150px);
`