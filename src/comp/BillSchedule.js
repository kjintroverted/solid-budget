import React, { useState, useEffect } from 'react';
import { WidgetContainer, HeaderBar, ActionBar, Spacer } from './theme/ThemeComp';
import { IconButton } from '@material-ui/core';

export default ({ data, balance, save }) => {
  let [isAdding, setAdding] = useState(false);
  let [isEditing, setEditing] = useState(false);

  let [bills, updateBills] = useState(data);

  useEffect(() => {
    if (bills) save(bills);
  }, [bills]);

  useEffect(() => {
    updateBills(data)
  }, [data]);

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

      <p>{ balance ? `Starting budget: ${ balance }` : "Missing account info. Please add a 'Main' account." }</p>
      { (!bills || !bills.length) && <p>No bills to track.</p> }
    </WidgetContainer>
  )
}
