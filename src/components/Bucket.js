import React from 'react';
import { WidgetContainer, HeaderBar, Spacer, ActionBar, Row, Column } from './theme/ThemeComp';
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
        <Column>
          <h2>{ bucket.name }</h2>
          <p>{ bucket.label }</p>
        </Column>
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
        <TextField type="number" placeholder="0" value={ bucket.value || '' } onChange={ handleChange('value', true) } />
      </Row>
    </WidgetContainer>
  )
}