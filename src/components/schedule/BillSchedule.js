import { IconButton } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { Card, CardHeader, Column, Divider, Icon, Pane, Row, Spacer } from "solid-core/dist/components/styled"
import { deleteThing, initThing, loadAllByName, loadByName, SaveState, saveThing, setAllAttr } from "solid-core/dist/pods";
import styled from "styled-components";
import { asMoney, getDebitBefore, getNextPayDate, THEME } from "../../util"
import BillForm from "./BillForm";
import { billStruct } from "./billStruct";
import SettingsForm from "./SettingsForm";
import { settingsStruct } from "./settingsStruct";

const BillSchedule = () => {

  const { dataset, setDataset, accounts } = useContext(SaveState)

  const [isAdding, setIsAdding] = useState(false)
  const [danger, setDanger] = useState(false)
  const [settings, updateSettings] = useState({})
  const [editSettings, setEditSettings] = useState(false)
  const [bills, updateBills] = useState([]);
  const [account, updateAccount] = useState(null);
  const [now] = useState(new Date());

  useEffect(() => {
    if (!dataset) return
    updateBills(loadAllByName(dataset, 'bill', billStruct).sort((a, b) => +a.date - +b.date))
    updateSettings(loadByName(dataset, 'settings', settingsStruct))
  }, [dataset])

  useEffect(() => {
    if (accounts) updateAccount(accounts.find(a => a.primary))
  }, [accounts])

  function toggleBill(b) {
    if (!b.thing) return
    let i = bills.findIndex(bill => bill.thing.url === b.thing.url)
    updateBills([
      ...bills.slice(0, i),
      { ...b, override: !b.override },
      ...bills.slice(i + 1)
    ])
  }

  async function addBill(bill) {
    setIsAdding(false)
    let { dataset, thing } = await initThing('bill', bill, billStruct)
    updateBills(
      [...bills, { ...bill, thing }]
        .sort((a, b) => +a.date - +b.date)
    )
    setDataset(dataset)
  }

  async function deleteBill(b) {
    let i = bills.findIndex(bill => bill.thing.url === b.thing.url)
    let { dataset } = await deleteThing(b.thing)
    updateBills([
      ...bills.slice(0, i),
      ...bills.slice(i + 1)
    ])
    setDataset(dataset)
  }

  async function saveSettings(s) {
    debugger
    let thing, dataset;
    if (!settings.thing) {
      ({ dataset, thing } = await initThing('settings', s, settingsStruct))
    } else {
      thing = setAllAttr(settings.thing, s);
      ({ dataset, saved: thing } = await saveThing(thing))
    }
    updateSettings({ ...s, thing })
    setDataset(dataset)
    setEditSettings(false)
  }

  function buildPayDays() {
    if (!settings.payday && !settings.paycheck) return []
    const d = new Date(now.getTime());
    let date = getNextPayDate(new Date(settings.payday), d);
    d.setDate(date);
    date = d.getDate();
    let days = [];

    while (d.getMonth() === now.getMonth()) {
      days.push({
        title: "Payday",
        credit: settings.paycheck,
        date,
        month: d.getMonth() + 1,
      })
      d.setDate(date + 14);
      date = d.getDate();
    }

    days.push({
      title: "Payday",
      credit: settings.paycheck,
      date,
      month: d.getMonth() + 1,
    })

    return days;
  }

  // MAIN READOUT ==============
  function buildSchedule() {
    if (!account || !bills.length) return <></>

    // GET CURR DATE INFO
    let date = now.getDate()
    let month = now.getMonth() + 1;

    let runningBalance = +account.balance;
    let minBalance = runningBalance;

    // GET PAYDAYS
    let paydays = buildPayDays()

    // BUILD OUT EXHAUSTIVE BILL/PAYDAY LIST
    let readout = [...bills, ...paydays]
      .sort((a, b) => +a.date - +b.date)
      .filter(b => !b.month || b.month === month)
      .map(b => {

        let paid = date > +b.date;
        paid = b.override ? !paid : paid;

        if (!paid) {
          runningBalance += b.credit ? +b.credit : -(+b.debit);
          minBalance = runningBalance < minBalance ? runningBalance : minBalance;
        }

        return (
          <ScheduleRow key={ b.title + b.date } className={ paid ? 'paid' : b.credit ? 'credit' : '' }>
            <DateText>{ month }/{ b.date }</DateText>
            <p className="clickable" onClick={ () => toggleBill(b) }>{ b.title }</p>
            <Spacer />
            <Column align="flex-end">
              {
                b.credit ?
                  <Credit>+{ b.credit }</Credit>
                  : <Debit>({ b.debit })</Debit>
              }
              { !paid && <p style={ { margin: 0 } }>{ asMoney(runningBalance).dollar }</p> }
            </Column>
            {
              (danger && b.debit) &&
              <IconButton onClick={ () => deleteBill(b) } color="secondary">
                <span className="material-icons">delete</span>
              </IconButton>
            }
          </ScheduleRow>
        )
      })

    if (!settings.payday && !settings.paycheck) {
      return [
        <Row key="info">
          <Icon className="material-icons">warning</Icon>
          For full readout please enter estimated paycheck value and a past pay date in settings.
        </Row>,
        ...readout
      ]
    }

    let nextPayday = paydays[paydays.length - 1];
    let availableFunds = runningBalance - getDebitBefore(bills, nextPayday.date, nextPayday.month)

    readout = [
      <Display key="op-budget">
        <Icon className="material-icons">info</Icon>
        Operational Budget: <b>{ availableFunds < minBalance ? availableFunds : minBalance }</b>
      </Display>,
      ...readout,
      <Info key="next-payday">
        <Icon className="material-icons">info</Icon>
        Next Payday: <b>{ nextPayday.month }/{ nextPayday.date }</b>
      </Info>,
      <Info key="avail-funds">
        <Icon className="material-icons">info</Icon>
        Available Funds: <b>{ asMoney(availableFunds).dollar }</b>
      </Info>
    ]

    return readout;
  }

  // RENDER ==================================
  return (
    <Pane width='100%'>
      <Card>
        <Row align="center">
          <CardHeader>Bill Schedule</CardHeader>
          <Spacer />
          <IconButton onClick={ () => setDanger(!danger) } color="primary">
            <span className="material-icons">{ danger ? 'done' : 'edit' }</span>
          </IconButton>
          <IconButton onClick={ () => setEditSettings(!editSettings) } color="primary">
            <span className="material-icons">settings</span>
          </IconButton>
          <IconButton onClick={ () => setIsAdding(!isAdding) } color="primary">
            <span className="material-icons">{ isAdding ? 'close' : 'add' }</span>
          </IconButton>
        </Row>
        <Divider theme={ THEME } />
        {
          editSettings &&
          <SettingsForm onSubmit={ saveSettings } savedSettings={ settings } />
        }
        {
          isAdding &&
          <BillForm onSubmit={ addBill } />
        }
        {
          buildSchedule()
        }
      </Card>
    </Pane>
  )
}

export default BillSchedule;

const ScheduleRow = styled.div`
  display: flex;
  border-bottom: solid 1px ${ THEME.dark }44;
  padding: 5px;
  border-radius: 3px;
  &.paid {
    opacity: .5;
  }
  &.credit {
    background: ${ THEME.secondary + "30" };
  }
`

const Credit = styled.p`
  color: green;
`

const Debit = styled.p`
  color: red;
`

const Info = styled.div`
  display: flex;
  align-items: center;
  font-style: italic;
  opacity: .5;
  margin-top: .5em;
`

const Display = styled.div`
  display: flex;
  align-items: center;
  font-style: italic;
  margin-bottom: .5em;
`

const DateText = styled.p`
  font-weight: 100;
  margin-right: .2em;
`