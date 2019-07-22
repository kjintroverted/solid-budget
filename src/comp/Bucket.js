import React from 'react';
import { WidgetContainer, HeaderBar, Spacer, ActionBar, Row } from './theme/ThemeComp';
import { IconButton, TextField } from '@material-ui/core';

export default ({ bucket, update, onDelete }) => {

  function handleChange(field, numeric) {
    return e => {
      let val = numeric ? +e.target.value : e.target.value;
      update({ ...bucket, [field]: val });
    }
  }

  return (
    <WidgetContainer>
      <HeaderBar>
        <h2>{ bucket.name } Bucket</h2>
        <Spacer />
        <ActionBar>
          <IconButton color="primary" onClick={ () => update({ ...bucket, favorite: !bucket.favorite }) }>
            <i className="material-icons">{ bucket.favorite ? 'star' : 'star_border' }</i>
          </IconButton>
          <IconButton onClick={ onDelete } >
            <i className="material-icons">delete</i>
          </IconButton>
        </ActionBar>
      </HeaderBar>
      <Row>
        <Spacer />
        <TextField type="number" value={ bucket.value || 0 } onChange={ handleChange('value', true) } />
      </Row>
    </WidgetContainer>
  )
}