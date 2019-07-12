import React, { useState, useEffect } from 'react';
import { IconButton, Input } from '@material-ui/core';
import styled from 'styled-components';

import { ActionBar, WidgetContainer, HeaderBar, Spacer } from './ThemeComp';
import AccountForm from './forms/AccountForm';
import { saveFile, loadFile } from '../util/pods';

export default ({ file }) => {
  let [accounts, updateAccounts] = useState([]);
  let [isAdding, setAdding] = useState(false);

  async function loadAccounts() {
    let loadedAccounts = await loadFile(file, []);
    updateAccounts(loadedAccounts);
    console.log('accounts', loadedAccounts);
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
        </ActionBar>
      </HeaderBar>
      { !accounts.length && "No Accounts to display." }
      {
        accounts.map((acc, i) => (
          <AccountView key={ `account-${ i }` }>
            <p>{ acc.name } ({ acc.label })</p>
            <Spacer />
            <p>{ acc.balance }</p>
          </AccountView>
        ))
      }
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
`