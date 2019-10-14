import React, { useState } from 'react';
import { WidgetContainer, HeaderBar, ActionBar, Spacer, RowCenter } from '../theme/ThemeComp';
import { IconButton, TextField, MenuItem, FormControl, FormLabel, Select, OutlinedInput } from '@material-ui/core';

export default ({ submit, labels }) => {
  let [values, setValues] = useState({})

  function handleChange(field) {
    return e => {
      setValues({ ...values, [field]: e.target.value })
    }
  }

  return (
    <WidgetContainer>
      <HeaderBar>
        <h2>New Bucket</h2>
        <Spacer />
        <ActionBar>
          <IconButton onClick={ () => submit(values) }>
            <i className="material-icons">done</i>
          </IconButton>
        </ActionBar>
      </HeaderBar>
      <RowCenter>
        <TextField variant="outlined" value={ values.name || "" } label="Bucket Name" onChange={ handleChange('name') } />
        <Spacer />
        <FormControl variant="outlined" style={ { minWidth: 120 } }>
          <FormLabel htmlFor="label">Label</FormLabel>
          <Select
            value={ values.label || "" }
            onChange={ handleChange('label') }
            input={ <OutlinedInput name="label" id="label" /> }
          >
            { labels.map(s => <MenuItem key={ `bucket-label-${ s }` } value={ s }>{ s }</MenuItem>) }
          </Select>
        </FormControl>
      </RowCenter>
    </WidgetContainer>
  )
}