import React from 'react';
import { WidgetContainer, HeaderBar, Spacer, ActionBar, Row, Column } from './theme/ThemeComp';
import { IconButton } from '@material-ui/core';
import BucketInput from './BucketInput';

export default ({ bucket, update, onDelete }) => {
  function handleChange(field) {
    return val => {
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
        <BucketInput value={ bucket.value } update={ handleChange('value') } />
      </Row>
    </WidgetContainer>
  )
}