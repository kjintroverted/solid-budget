import React, { useState } from 'react';
import { TextField, IconButton, FormControl, FormHelperText, FormControlLabel, Checkbox, RadioGroup, Radio } from '@material-ui/core';
import styled from 'styled-components';

import { months } from '../../util/helper'

export default ({ onSubmit }) => {

  let [bill, setValues] = useState({});
  let [error, setError] = useState(null);
  let [mode, setMode] = useState("monthly"); // monthly, once, custom

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

  function changeMode(e) {
    const newMode = e.target.value;
    if (newMode === "once")
      setValues({ ...bill, months: null, oneTime: true })
    else if (newMode === "custom")
      setValues({ ...bill, months: [], oneTime: false })
    else
      setValues({ ...bill, months: null, oneTime: false })

    console.log("update", newMode);

    setMode(newMode);
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
      <RadioGroup aria-label="position" name="position" value={ mode || "monthly" } onChange={ changeMode } row>
        <FormControlLabel
          value="monthly"
          control={ <Radio color="primary" /> }
          label="Monthly"
          labelPlacement="end"
        />
        <FormControlLabel
          value="once"
          control={ <Radio color="primary" /> }
          label="One Time"
          labelPlacement="end"
        />
        <FormControlLabel
          value="custom"
          control={ <Radio color="primary" /> }
          label="Select Months"
          labelPlacement="end"
        />
      </RadioGroup>
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
      { mode === "custom" &&
        <>
          <p>Occurs in these months:</p>
          <FormGroup>
            { months.map((name, i) => (
              <FormControlLabel
                key={ name }
                control={
                  <Checkbox
                    checked={ bill.months && bill.months.indexOf(i + 1) !== -1 }
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