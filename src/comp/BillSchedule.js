import React, { useState } from 'react';
import { WidgetContainer, HeaderBar, ActionBar, Spacer } from './theme/ThemeComp';
import { IconButton } from '@material-ui/core';

export default ({ data, balance, save }) => {
  let [isAdding, setAdding] = useState(false);
  let [isEditing, setEditing] = useState(false);

  return (
    <WidgetContainer>
      <HeaderBar>
        <h2>Schedule</h2>
        <Spacer />
        <ActionBar>
          <IconButton onClick={ () => setAdding(!isAdding) }>
            <i className="material-icons">{ isAdding ? 'close' : 'add' }</i>
          </IconButton>
          <IconButton onClick={ () => setEditing(!isEditing) }>
            <i className="material-icons">{ isEditing ? 'close' : 'edit' }</i>
          </IconButton>
        </ActionBar>
      </HeaderBar>
    </WidgetContainer>
  )
}
