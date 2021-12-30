import { IconButton } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Card, CardHeader, Column, Divider, Icon, Pane, Row, Spacer } from "solid-core/dist/components/styled"
import { initThing, loadThing, saveThing, setAllAttr } from "solid-core/dist/pods";
import styled from "styled-components";
import { THEME } from "../../util"
import BillForm from "./BillForm";
import { billStruct } from "./billStruct";
import SettingsForm from "./SettingsForm";
import { settingsStruct } from "./settingsStruct";

const BillSchedule = ({ settingsThing, billData, account }) => {

  const [isAdding, setIsAdding] = useState(false)
  const [settings, updateSettings] = useState({})
  const [editSettings, setEditSettings] = useState(false)
  const [bills, updateBills] = useState([]);
  const [now] = useState(new Date());

  useEffect(() => {
    if (billData) updateBills(billData.sort((a, b) => +a.date - +b.date))
  }, [billData])

  useEffect(() => {
    if (!settingsThing) return
    loadThing(settingsThing.url, settingsStruct)
      .then(updateSettings)
  }, [settingsThing])

  async function addBill(bill) {
    setIsAdding(false)
    let thing = await initThing('bill', bill, billStruct)
    updateBills(
      [...bills, { ...bill, thing }]
        .sort((a, b) => +a.date - +b.date)
    )
  }

  async function saveSettings(s) {
    let thing;
    if (!settings.thing) {
      thing = await initThing('settings', s, settingsStruct)
    } else {
      thing = setAllAttr(settings.thing, settingsStruct, s)
      await saveThing(thing)
    }
    updateSettings({ ...s, thing })
    setEditSettings(false)
  }

  function getNextPayDate(basePayDate, date, inclusive) {
    let dayDiff = Math.floor((date.getTime() - basePayDate.getTime()) / 86400000) % 14;
    return !dayDiff && inclusive ? date.getDate() : date.getDate() + 14 - dayDiff;
  }

  function buildPayDays() {
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

  function getDebitBefore(date, month) {
    return bills
      .filter(b => (+b.date <= date) && (!b.month || b.month === month))
      .reduce((prev, curr) => +curr.debit + prev, 0)
  }

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
        if (!paid) {
          runningBalance += b.credit ? +b.credit : -(+b.debit);
          minBalance = runningBalance < minBalance ? runningBalance : minBalance;
        }

        return (
          <ScheduleRow className={ paid ? 'paid' : '' } key={ b.thing ? b.thing.url : b.date }>
            <DateText>{ month }/{ b.date }</DateText>
            <p>{ b.title }</p>
            <Spacer />
            <Column align="flex-end">
              {
                b.credit ?
                  <Credit>+{ b.credit }</Credit>
                  : <Debit>({ b.debit })</Debit>
              }
              { !paid && <p style={ { margin: 0 } }>{ runningBalance }</p> }
            </Column>
          </ScheduleRow>
        )
      })

    let nextPayday = paydays[paydays.length - 1];
    let availableFunds = runningBalance - getDebitBefore(nextPayday.date, nextPayday.month)

    readout = [
      <Display>
        <Icon className="material-icons">info</Icon>
        Operational Budget: <b>{ availableFunds < minBalance ? availableFunds : minBalance }</b>
      </Display>,
      ...readout,
      <Info>
        <Icon className="material-icons">info</Icon>
        Next Payday: <b>{ nextPayday.month }/{ nextPayday.date }</b>
      </Info>,
      <Info>
        <Icon className="material-icons">info</Icon>
        Available Funds: <b>{ availableFunds }</b>
      </Info>
    ]

    return readout;
  }

  // RENDER ==================================
  return (
    <Pane>
      <Card>
        <Row align="center">
          <CardHeader>Bill Schedule</CardHeader>
          <Spacer />
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
  border-bottom: solid 1px whitesmoke;
  &.paid {
    opacity: .5;
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