import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WidgetContainer, HeaderBar, ActionBar, Spacer, IndentRow, LoadingContainer, Info, ErrorText, RowCenter } from '../components/theme/ThemeComp';
import { theme } from '../components/theme/Provider';
import { IconButton, CircularProgress, Tooltip } from '@material-ui/core';
import BillForm from '../components/forms/BillForm';
import styled from 'styled-components';
import { getNextPayDate, calculateBillsTil } from '../util/helper';
import { deleteFile } from '../util/pods';

export default ({ data, balance, settings, onUpdate, onDelete }) => {
  let [isAdding, setAdding] = useState(false);
  let [isEditing, setEditing] = useState(false);
  let [overrides, setOverrides] = useState([]);
  let [bills, updateBills] = useState(data);

  async function deleteBill(e, i) {
    e.preventDefault();
    onDelete(bills[i]);
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
    if (!bills) return;
    onUpdate(bills.sort((a, b) => a.date - b.date));
  }, [bills, onUpdate]);

  useEffect(() => {
    updateBills(data)
  }, [data]);


  function buildSchedule() {
    if (!bills || !settings.paycheck || !settings.payDate) return null;
    let now = new Date();
    const paydays = buildPayDays(now);
    const schedule = [...paydays, ...bills].sort((a, b) => a.date - b.date)

    let runningBalance = balance;
    let minBalance = runningBalance;

    let rows = schedule
      .filter(item => (isEditing && !item.isCredit) ||
        ((!item.months ||
          item.months.indexOf((now.getMonth() + 1)) !== -1) && !item.future))
      .map((item, i) => {
        let paid = item.date < now.getDate();
        if ((paid && item.oneTime) // DELETE PAID ONE-TIME EXPENSES
          || !item.title || !item.payment || !item.date) { // DELETE CORRUPTED ITEMS
          deleteFile(item.uri)
            .then(() => console.info(`Deleted "${ item.title }"`))
          return null;
        }

        if (overrides.indexOf(i) >= 0) paid = !paid;

        if (item.isCredit) runningBalance += item.payment;  // ADD PAYDAY
        else if (!paid) runningBalance -= item.payment;     // SUBTRACT BILL PAYMENT

        if (runningBalance < minBalance) minBalance = runningBalance; // UPDATE MIN BALANCE

        let dateContent = !item.months || item.months.indexOf(now.getMonth() + 1) !== -1 ?
          `${ now.getMonth() + 1 }/${ item.date }` : <i className="material-icons">warning</i>;

        return (
          <IndentRow
            key={ `item-row-${ i }` }
            style={ item.isCredit ? { outlineColor: theme.palette.primary.light, outlineStyle: 'solid' } : null }
            className={ paid ? 'inactive clickable' : 'clickable' }
          >
            <DateText>{ dateContent }</DateText>
            <p onClick={ () => toggleOverride(i) }>{ item.title }</p>
            <Spacer />
            <Column>
              { !item.isCredit ? <Debit>({ item.payment })</Debit> : <Credit>+{ item.payment }</Credit> }
              { !paid && <p>{ runningBalance }</p> }
            </Column>
            { isEditing && // DELETE BUTTON
              <IconButton color='secondary' onClick={ e => deleteBill(e, bills.findIndex(val => val.uri === item.uri)) }>
                <i className="material-icons">delete</i>
              </IconButton>
            }
          </IndentRow >
        )
      });

    let futurePayDay = paydays.find(item => item.future);
    let eomFunds = runningBalance - calculateBillsTil(bills, futurePayDay.month, futurePayDay.date);
    let currentFunds = Math.min(eomFunds, minBalance);

    rows = [
      <RowCenter key="ops-budget">
        <Tooltip title="Lowest predicted account balance. Don't spend more than this.">
          <i className="material-icons">info_outline</i>
        </Tooltip>
        <i>Operational Budget: <b>{ currentFunds }</b></i>
      </RowCenter>,                                                  // OPS BUDGET
      ...rows,
      <Info key="summary">
        { settings.payDate ?                                // NEXT PAYDAY
          <RowCenter>
            <Tooltip title="First payday of next month">
              <i className="material-icons">info_outline</i>
            </Tooltip>
            <i>Next payday: <strong>{ futurePayDay.month }/{ futurePayDay.date }</strong></i>
          </RowCenter>
          : <Link to="/settings"><ErrorText>For better information, configure a <strong>pay date</strong> in app settings.</ErrorText></Link>
        }
        { settings.paycheck ?                               // EOM FUNDS
          <RowCenter>
            <Tooltip title="Predicted final balance for the month, subtract all bill payments before next payday.">
              <i className="material-icons">info_outline</i>
            </Tooltip>
            <i>Funds available: <strong>{ eomFunds }</strong></i>
          </RowCenter>
          : <Link to="/settings"><ErrorText>For better information, configure a <strong>pay check</strong> in app settings.</ErrorText></Link>
        }
      </Info>
    ]

    return rows;
  }

  function buildPayDays(now) {
    const d = new Date(now.getTime());
    let date = getNextPayDate(new Date(settings.payDate), d);
    d.setDate(date);
    date = d.getDate();
    let days = [];
    while (d.getMonth() === now.getMonth()) {
      days.push({
        title: "Payday",
        isCredit: true,
        date,
        month: d.getMonth() + 1,
        payment: settings.paycheck
      })
      d.setDate(date + 14);
      date = d.getDate();
    }

    days.push({
      title: "Payday",
      isCredit: true,
      date,
      month: d.getMonth() + 1,
      future: true
    })

    return days;
  }

  // RENDER =======================
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

      { buildSchedule() }

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

const Credit = styled.p`
  color: green;
`
