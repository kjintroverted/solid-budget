import React, { useState, useEffect } from 'react';
import { IconButton, Input, Badge } from '@material-ui/core';

import { ActionBar, WidgetContainer, HeaderBar, Spacer, IndentRow, Column } from './theme/ThemeComp';
import AccountForm from './forms/AccountForm';

export default ({ data, buckets, save }) => {
  let [accounts, updateAccounts] = useState(data);
  let [isAdding, setAdding] = useState(false);
  let [isEditing, setEditing] = useState(false);
  let [show, updateShow] = useState([]);

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

  function getBuckets(label) {
    if (!buckets) return []
    return buckets.filter(b => b.label === label);
  }

  function totalValue(arr) {
    return arr.reduce((acc, { value }) => acc + value, 0)
  }

  function toggleShow(i) {
    let index = show.indexOf(i);
    if (index === -1) updateShow([...show, i])
    else updateShow([...show.slice(0, index), ...show.slice(index + 1)])
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
        accounts.map((acc, i) => {
          let allocatedBuckets = getBuckets(acc.label);
          let allocatedValue = totalValue(allocatedBuckets);
          return (
            <Column key={ `account-${ i }` }>
              <IndentRow className="clickable" onClick={ () => toggleShow(i) }>
                <h3>{ acc.name } ({ acc.label })</h3>
                <Spacer />
                <Badge color="secondary"
                  badgeContent={ acc.balance - allocatedValue } invisible={ allocatedValue <= acc.balance }>
                  <Input
                    type="number"
                    value={ acc.balance }
                    onChange={ e => updateBalance(i, +e.target.value) }
                  />
                </Badge>
                { isEditing && // DELETE BUTTON
                  <IconButton color='secondary' onClick={ () => deleteAccount(i) }>
                    <i className="material-icons">delete</i>
                  </IconButton>
                }
              </IndentRow>
              { show.indexOf(i) !== -1 && !!allocatedBuckets.length &&
                <>
                  <IndentRow><p><strong>Total Allocated</strong></p><Spacer /><p><strong>{ allocatedValue }</strong></p></IndentRow>
                  { allocatedBuckets.map(bucket => <IndentRow><p>{ bucket.name }</p><Spacer /><p>{ bucket.value }</p></IndentRow>) }
                </>
              }
            </Column>
          )
        })
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
