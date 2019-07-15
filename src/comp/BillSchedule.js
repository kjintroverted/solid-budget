import React, { useState, useEffect } from 'react';
import { WidgetContainer, HeaderBar, ActionBar, Spacer, IndentRow } from './theme/ThemeComp';
import { IconButton } from '@material-ui/core';
import BillForm from './forms/BillForm';
import styled from 'styled-components';

export default ({ data, balance, settings, save }) => {
  let [isAdding, setAdding] = useState(false);
  let [isEditing, setEditing] = useState(false);
  let [overrides, setOverrides] = useState([]);

  let [bills, updateBills] = useState(data);

  async function deleteBill(i) {
    updateBills([...bills.slice(0, i), ...bills.slice(i + 1)]);
  }

  function toggleOverride(i) {
    let index = overrides.indexOf(i);
    if (index >= 0) {
      setOverrides([...overrides.slice(0, index), ...overrides.slice(index + 1)]);
      return;
    }
    setOverrides([...overrides, i]);
  }

  useEffect(() => {
    if (bills) save(bills);
  }, [bills]);

  useEffect(() => {
    updateBills(data)
  }, [data]);

  let now = new Date();

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

      { (!bills || !bills.length) && <p>No bills to track.</p> }

      { // ADDING NEW BILL
        isAdding &&
        <BillForm
          onSubmit={
            data => {
              updateBills([...bills, data].sort((a, b) => a.date - b.date));
              setAdding(false);
            }
          } />
      }

      {
        bills &&
        bills.map((bill, i) => {
          if (bill.months && bill.months.indexOf(now.getMonth() + 1) >= 0) return;
          let paid = bill.date < now.getDate();
          if (overrides.indexOf(i) >= 0) paid = !paid;
          if (!paid) balance -= bill.payment;
          return (
            <IndentRow
              key={ `bill-${ i }` }
              className={ paid ? 'inactive clickable' : 'clickable' }
              onClick={ () => toggleOverride(i) }
            >
              <DateText>{ now.getMonth() + 1 }/{ bill.date }</DateText>
              <p>{ bill.title }</p>
              <Spacer />
              <Column>
                <Debit>({ bill.payment })</Debit>
                { !paid && <p>{ balance }</p> }
              </Column>
              { isEditing && // DELETE BUTTON
                <IconButton color='secondary' onClick={ () => deleteBill(i) }>
                  <i className="material-icons">delete</i>
                </IconButton>
              }
            </IndentRow>
          )
        }
        )
      }
    </WidgetContainer>
  )
}

const DateText = styled.p`
  margin-right: 5px;
  opacity: .3;
`

const Column = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const Debit = styled.p`
  color: red;
`
