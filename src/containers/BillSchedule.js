import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WidgetContainer, HeaderBar, ActionBar, Spacer, IndentRow, LoadingContainer, Info, ErrorText } from '../components/theme/ThemeComp';
import { IconButton, CircularProgress } from '@material-ui/core';
import BillForm from '../components/forms/BillForm';
import styled from 'styled-components';
import { getNextPayDate, calculateBillsTil } from '../util/helper';
import { deleteFile } from '../util/pods';

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
    if (!bills) return;
    onUpdate(bills.sort((a, b) => a.date - b.date));
  }, [bills, onUpdate]);

  useEffect(() => {
    updateBills(data)
  }, [data]);


  function buildSchedule() {
    if (!bills) return null;
    let now = new Date();
    const paydays = buildPayDays(now);
    const schedule = [...paydays, ...bills].sort((a, b) => a.date - b.date)

    let runningBalance = balance;
    let rows = schedule
      .filter(item => (!item.months || item.months.indexOf((now.getMonth() + 1)) !== -1) && !item.future)
      .map((item, i) => { // MAIN item READOUT
        let paid = item.date < now.getDate();
        if (paid && item.oneTime) {
          deleteFile(item.uri)
            .then(() => console.info(`Deleted "${ item.title }" (One-time payment)`))
          return null;
        }

        if (overrides.indexOf(i) >= 0) paid = !paid;
        if (!paid) runningBalance -= item.payment;

        return (
          <IndentRow
            key={ `item-row-${ i }` }
            className={ paid ? 'inactive clickable' : 'clickable' }
            onClick={ () => toggleOverride(i)
            }
          >
            <DateText>{ now.getMonth() + 1 }/{ item.date }</DateText>
            <p>{ item.title }</p>
            <Spacer />
            <Column>
              { item.payment > 0 ? <Debit>({ item.payment })</Debit> : <Credit>+{ item.payment * -1 }</Credit> }
              { !paid && <p>{ runningBalance }</p> }
            </Column>
            { isEditing && // DELETE BUTTON
              <IconButton color='secondary' onClick={ () => deleteBill(i) }>
                <i className="material-icons">delete</i>
              </IconButton>
            }
          </IndentRow >
        )
      });

    let futurePayDay = paydays.find(item => item.future);
    rows.push(
      <Info key="summary">
        { settings.payDate ?
          <i>Next payday: <strong>{ futurePayDay.month }/{ futurePayDay.date }</strong></i> :
          <Link to="/settings"><ErrorText>For better information, configure a <strong>pay date</strong> in app settings.</ErrorText></Link>
        }
        { settings.paycheck ?
          <i>Maximum available funds: <strong>{ runningBalance - calculateBillsTil(bills, futurePayDay.month, futurePayDay.date) }</strong></i> :
          <Link to="/settings"><ErrorText>For better information, configure a <strong>pay check</strong> in app settings.</ErrorText></Link>
        }
      </Info>
    )

    return rows;
  }

  function buildPayDays(now) {
    const d = new Date(now.getTime());
    let date = getNextPayDate(new Date(settings.payDate), d);
    let days = [];
    while (d.getMonth() === now.getMonth()) {
      days.push({
        title: "Payday",
        date,
        month: d.getMonth() + 1,
        payment: -1 * settings.paycheck
      })
      d.setDate(date + 14);
      date = d.getDate();
    }

    days.push({
      title: "Payday",
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
