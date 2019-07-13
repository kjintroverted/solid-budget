import React, { useState, useEffect } from 'react';
import { WidgetContainer, HeaderBar, ActionBar, Spacer, IndentRow } from './theme/ThemeComp';
import { IconButton } from '@material-ui/core';
import BillForm from './forms/BillForm';

export default ({ data, balance, save }) => {
  let [isAdding, setAdding] = useState(false);
  let [isEditing, setEditing] = useState(false);

  let [bills, updateBills] = useState(data);

  async function deleteBill(i) {
    updateBills([...bills.slice(0, i), ...bills.slice(i + 1)]);
  }

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

      {
        (bills && bills.length) &&
        bills.map((bill, i) => (
          <IndentRow key={ `account-${ i }` }>
            <p>{ bill.title }</p>
            <Spacer />
            <p>{ bill.payment }</p>
            { isEditing && // DELETE BUTTON
              <IconButton color='secondary' onClick={ () => deleteBill(i) }>
                <i className="material-icons">delete</i>
              </IconButton>
            }
          </IndentRow>
        ))
      }

      { // ADDING NEW BILL
        isAdding &&
        <BillForm
          onSubmit={
            data => {
              updateBills([...bills, data]);
              setAdding(false);
            }
          } />
      }
    </WidgetContainer>
  )
}
