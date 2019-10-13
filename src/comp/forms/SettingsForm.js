import React, { useState, useEffect } from 'react';

import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

const SettingsForm = ({ data, onUpdate }) => {

  const [values, setValues] = useState(data)

  function handleChange(field, num) {
    return e => {
      const val = num ? +e.target.value : e.target.value;
      setValues({ ...data, [field]: val })
    }
  }

  function handleDate(field) {
    return date => {
      console.log(date);
      onUpdate({ ...data, [field]: date.toLocaleDateString() })
    }
  }

  function saveToParent() {
    onUpdate(values);
  }

  useEffect(() => { if (data) setValues(data) }, [data]);

  return (
    <FormContainer>
      <TextField
        type="number"
        value={ values.paycheck || "" }
        label="Average Paycheck "
        placeholder="Dollars"
        onChange={ handleChange('paycheck', true) }
        onBlur={ saveToParent }
      />
      <MuiPickersUtilsProvider utils={ DateFnsUtils } >
        <KeyboardDatePicker
          margin="normal"
          label="Past Pay Date"
          format="MM/dd/yyyy"
          value={ values.payDate ? new Date(values.payDate) : new Date() }
          onChange={ handleDate('payDate') }
        />
      </MuiPickersUtilsProvider>
      <TextField
        value={ values.shared || "" }
        label="Share Budget"
        placeholder="WebID"
        onChange={ handleChange('shared') }
        onBlur={ saveToParent }
      />
      <TextField
        value={ values.link || "" }
        label="Link to Budget"
        placeholder="WebID"
        onChange={ handleChange('link') }
        onBlur={ saveToParent }
      />
    </FormContainer>
  )
}

export default SettingsForm;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
`