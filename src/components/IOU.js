import React from 'react';
import { HeaderBar, Spacer, ActionBar } from './theme/ThemeComp';
import { IconButton } from '@material-ui/core';

const IOU = () => {
  return (
    <HeaderBar>
      <h2>Munny Todos</h2>
      <Spacer />
      <ActionBar>
        <IconButton>
          <i className="material-icons">add</i>
        </IconButton>
        <IconButton color="primary">
          <i className="material-icons">{ true ? 'arrow_drop_down' : 'arrow_drop_up' }</i>
        </IconButton>
      </ActionBar>
    </HeaderBar>
  )
}

export default IOU;