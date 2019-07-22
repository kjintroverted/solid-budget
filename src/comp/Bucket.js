import React from 'react';
import { WidgetContainer, HeaderBar, Spacer, ActionBar } from './theme/ThemeComp';
import { IconButton } from '@material-ui/core';

export default ({ bucket, update, onDelete }) => {
  return (
    <WidgetContainer>
      <HeaderBar>
        <h2>{ bucket.name } Bucket</h2>
        <Spacer />
        <ActionBar>
          <IconButton onClick={ () => update({ ...bucket, favorite: !bucket.favorite }) }>
            <i className="material-icons">{ bucket.favorite ? 'star' : 'star_border' }</i>
          </IconButton>
          <IconButton onClick={ onDelete } >
            <i className="material-icons">delete</i>
          </IconButton>
        </ActionBar>
      </HeaderBar>
    </WidgetContainer>
  )
}