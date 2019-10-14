import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WidgetContainer, HeaderBar, ActionBar, Spacer, IndentRow, Info, ErrorText, LoadingContainer } from './theme/ThemeComp';
import { IconButton, CircularProgress } from '@material-ui/core';
import BillForm from './forms/BillForm';
import styled from 'styled-components';
import { theme } from './theme/Provider';
import { calculateBillsTil, getNextPayDate } from '../util/helper';

export default ({ data, balance, settings, onUpdate, onDelete }) => {
  let [isAdding, setAdding] = useState(false);
  let [isEditing, setEditing] = useState(false);
  let [overrides, setOverrides] = useState([]);

  let [bills, updateBills] = useState(data);

  async function deleteBill(i) {
    onDelete(bills[i])
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
    if (bills) onUpdate(bills.sort((a, b) => a.date - b.date));
  }, [bills, onUpdate]);

  useEffect(() => {
    updateBills(data)
  }, [data]);

  let now = new Date();

  let payDate;
  // BUILD BILL INFO ROWS
  function createBillRows() {
    payDate = getNextPayDate(new Date(settings.payDate), now);
    let billRows = bills.map((bill, i) => { // MAIN BILL READOUT
      if (bill.months && bill.months.indexOf((now.getMonth() + 1)) < 0) return null;
      let paid = bill.date < now.getDate();
      let payday = bill.date >= payDate;
      if (overrides.indexOf(i) >= 0) paid = !paid;

      let paydayRow;
      if (payday) { // ADDS A PRE-ROW FOR PAYDAY INFO
        if (now.getDate() < payDate) {
          balance += +settings.paycheck;
          paydayRow =
            <IndentRow key={ `payday-${ payDate }` }
              style={ { background: theme.palette.primary.light, color: theme.palette.primary.contrastText } }>
              <DateText>{ now.getMonth() + 1 }/{ payDate }</DateText>
              <p>Payday</p>
              <Spacer />
              <p>{ balance }</p>
            </IndentRow>
        }
        payDate += 14;
      }

      if (!paid) balance -= bill.payment;

      return (
        <div key={ `billrow-${ i }` }>
          { paydayRow }
          <IndentRow
            className={ paid ? 'inactive clickable' : 'clickable' }
            onClick={ () => toggleOverride(i)
            }
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
          </IndentRow >
        </div>
      )
    }
    )
    let nextPayDate = new Date(now.getTime());
    nextPayDate.setDate(payDate);
    payDate = nextPayDate.getDate();
    if (payDate > 28) {
      balance += settings.paycheck;
      billRows.push(
        <IndentRow key={ `payday-${ payDate }` }
          style={ { background: theme.palette.primary.light, color: theme.palette.primary.contrastText } }>
          <DateText>{ now.getMonth() + 1 }/{ payDate }</DateText>
          <p>Payday</p>
          <Spacer />
          <p>{ balance }</p>
        </IndentRow>
      )
      nextPayDate.setDate(payDate + 14);
    }

    let summary =
      <Info key="summary">
        { settings.payDate ?
          <i>Next payday: <strong>{ nextPayDate.getMonth() + 1 }/{ nextPayDate.getDate() }</strong></i> :
          <Link to="/settings"><ErrorText>For better information, configure a <strong>pay date</strong> in app settings.</ErrorText></Link>
        }
        { settings.paycheck ?
          <i>Maximum available funds: <strong>{ balance - calculateBillsTil(bills, nextPayDate.getMonth(), nextPayDate.getDate()) }</strong></i> :
          <Link to="/settings"><ErrorText>For better information, configure a <strong>pay check</strong> in app settings.</ErrorText></Link>
        }
      </Info>

    billRows.push(summary);

    return billRows;
  }

  return (
    <WidgetContainer>
      <HeaderBar>
        <h2>Bill Planning</h2>
        <Spacer />
        <ActionBar>
          <IconButton color="secondary" onClick={ () => setAdding(!isAdding) } disabled={ !bills }>
            <i className="material-icons">{ isAdding ? 'close' : 'add' }</i>
          </IconButton>
          <IconButton color="secondary" onClick={ () => setEditing(!isEditing) } disabled={ !bills }>
            <i className="material-icons">{ isEditing ? 'close' : 'edit' }</i>
          </IconButton>
        </ActionBar>
      </HeaderBar>

      { (!bills) && <LoadingContainer><CircularProgress /></LoadingContainer> }

      { (bills && !bills.length) && <p>No bills to track.</p> }

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

      {
        bills && settings &&
        createBillRows()
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
