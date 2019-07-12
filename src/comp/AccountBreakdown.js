import React, { useState, useEffect } from 'react';
import { IconButton, Input } from '@material-ui/core';
import styled from 'styled-components';

import { ActionBar, WidgetContainer, HeaderBar, Spacer } from './ThemeComp';
import AccountForm from './forms/AccountForm';
import { saveFile, loadFile } from '../util/pods';

export default ({ file }) => {
  let [accounts, updateAccounts] = useState([]);
  let [isAdding, setAdding] = useState(false);
  let [isEditing, setEditing] = useState(false);

  async function loadAccounts() {
    let loadedAccounts = await loadFile(file, []);
    updateAccounts(loadedAccounts);
    console.log('accounts', loadedAccounts);
  }

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
    loadAccounts();
    return () => saveFile(file, accounts);
  }, [file]);

  useEffect(() => {
    saveFile(file, accounts);
  }, [accounts])

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
      { !accounts.length && "No Accounts to display." }

      {/* MAIN ACCOUNT DISPLAY */ }
      {
        accounts.map((acc, i) => (
          <AccountView key={ `account-${ i }` }>
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
          </AccountView>
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

const AccountView = styled.div`
  display: flex;
  padding-left: 15px;
`