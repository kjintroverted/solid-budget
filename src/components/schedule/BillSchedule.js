import { IconButton } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Card, CardHeader, Column, Divider, Pane, Row, Spacer } from "solid-core/dist/components/styled"
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
    debugger
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

  function buildSchedule() {
    if (!account || !bills.length) return <></>

    // GET CURR DATE INFO
    let date = now.getDate()
    let month = now.getMonth() + 1;

    let runningBalance = account.balance;

    // BUILD OUT EXHAUSTIVE BILL/PAYDAY LIST
    let readout = bills
      .filter(b => !b.month || b.month === month)
      .map(b => {
        let paid = date > +b.date;
        runningBalance -= paid ? 0 : +b.debit;
        return (
          <ScheduleRow className={ paid ? 'paid' : '' } key={ b.thing.url }>
            <DateText>{ month }/{ b.date }</DateText>
            <p>{ b.title }</p>
            <Spacer />
            <Column align="flex-end">
              <Debit>({ b.debit })</Debit>
              { !paid && <p style={ { margin: 0 } }>{ runningBalance }</p> }
            </Column>
          </ScheduleRow>
        )
      })
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

const Debit = styled.p`
  color: red;
`

const DateText = styled.p`
  font-weight: 100;
  margin-right: .2em;
`