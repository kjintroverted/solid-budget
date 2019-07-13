import React, { useState, useEffect } from 'react';
import { IconButton, Input } from '@material-ui/core';
import styled from 'styled-components';

import { ActionBar, WidgetContainer, HeaderBar, Spacer, IndentRow } from './theme/ThemeComp';
import AccountForm from './forms/AccountForm';

export default ({ data, save }) => {
  let [accounts, updateAccounts] = useState(data);
  let [isAdding, setAdding] = useState(false);
  let [isEditing, setEditing] = useState(false);

  async function deleteAccount(i) {
    updateAccounts([...accounts.slice(0, i), ...accounts.slice(i + 1)]);
  }

  async function updateBalance(i, balance) {
    updateAccounts([
      ...accounts.slice(0, i),
      { ...accounts[i], balance },
      ...accounts.slice(i + 1)
    ]);
  }

  useEffect(() => {
    if (accounts) save(accounts);
  }, [accounts]);

  useEffect(() => {
    updateAccounts(data);
  }, [data]);

  return (
    <WidgetContainer>
      <HeaderBar>
        <h2>Accounts</h2>
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

      {/* NO ACCOUNTS TO DISPLAY */ }
      { (!accounts || !accounts.length) && "No Accounts to display." }

      {/* MAIN ACCOUNT DISPLAY */ }
      { accounts &&
        accounts.map((acc, i) => (
          <IndentRow key={ `account-${ i }` }>
            <p>{ acc.name } ({ acc.label })</p>
            <Spacer />
            <Input
              type="number"
              value={ acc.balance }
              onChange={ e => updateBalance(i, e.target.value) }
            />
            { isEditing && // DELETE BUTTON
              <IconButton color='secondary' onClick={ () => deleteAccount(i) }>
                <i className="material-icons">delete</i>
              </IconButton>
            }
          </IndentRow>
        ))
      }

      {/* DISPLAY FORM FOR NEW ACCOUNT */ }
      { isAdding &&
        <AccountForm
          onSubmit={ account => {
            updateAccounts([...accounts, account]);
            setAdding(false);
          } }
          onCancel={ () => setAdding(false) } />
      }
    </WidgetContainer>
  )
}
