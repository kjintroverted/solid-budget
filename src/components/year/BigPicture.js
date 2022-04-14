import { useContext, useEffect, useState } from "react"
import { Card, CardHeader, Column, Divider, Icon, Pane, Row, Spacer, Title } from "solid-core/dist/components/styled"
import { loadAllByName, loadByName, SaveState } from "solid-core/dist/pods"
import styled from "styled-components"
import { getDebitBefore, getNextPayDate, THEME, Credit, Debit, Info, asMoney } from "../../util"
import { billStruct } from "../schedule/billStruct"
import { settingsStruct } from "../schedule/settingsStruct"

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

const BigPicture = () => {

  const { dataset } = useContext(SaveState);
  const [settings, updateSettings] = useState(null);
  const [bills, updateBills] = useState([]);
  const [now] = useState(new Date());

  useEffect(() => {
    if (!dataset) return
    updateSettings(loadByName(dataset, 'settings', settingsStruct))
    updateBills(loadAllByName(dataset, 'bill', billStruct))
  }, [dataset]);

  if (!settings) return <></>

  function getPaydayCount() {
    let counter = {};

    let date = new Date(now.getTime());
    date.setDate(getNextPayDate(new Date(settings.payday), now))

    // GET TO NEXT MONTH
    while (date.getMonth() === now.getMonth()) {
      date.setDate(date.getDate() + 14)
    }

    // CONTINUE FOR 12 MONTHS
    while (date.getMonth() !== now.getMonth()) {
      let m = date.getMonth();
      counter[MONTHS[m]] = counter[MONTHS[m]] ? counter[MONTHS[m]] + 1 : 1;
      date.setDate(date.getDate() + 14)
    }

    return counter;
  }

  function buildReadout() {
    let paydays = getPaydayCount();
    let month = now.getMonth() >= 11 ? 0 : now.getMonth() + 1;
    let readout = [];
    let totalCredit = 0;
    let totalDebit = 0;
    while (month !== now.getMonth()) {
      let credit = +settings.paycheck * paydays[MONTHS[month]];
      totalCredit += credit;
      let debit = getDebitBefore(bills, 31, month + 1)
      totalDebit += debit;

      readout = [...readout,
      <div key={ MONTHS[month] }>
        <Row>
          <Title>
            {
              paydays[MONTHS[month]] > 2 &&
              <Decoration className="material-icons">
                auto_awesome
              </Decoration>
            }
            { MONTHS[month] }
          </Title>
          <Spacer />
          <Column align="center">
            <h3>{ asMoney(credit - debit).dollar }</h3>
            <Credit>{ asMoney(credit).dollar }</Credit>
            <Debit>({ asMoney(debit).dollar })</Debit>
          </Column>
        </Row>
        <Divider theme={ THEME } />
      </div>
      ]
      month = month >= 11 ? 0 : month + 1;
    }
    return [
      readout,
      <Info key="money-usage">
        <Icon className="material-icons">info</Icon>
        Money with a Job: <b>{ Math.round((totalDebit / totalCredit) * 100) }%</b>
      </Info>
    ]
  }

  return (
    <Pane width='100%'>
      <Card>
        <CardHeader>BigPicture</CardHeader>
        <Divider theme={ THEME } />
        {
          buildReadout()
        }
      </Card>
    </Pane>
  )
}

export default BigPicture;

const Decoration = styled.span`
        font-size: .7em;
        position: absolute;
        top: -.3em;
        right: -1em;
        color: ${ THEME.secondary }
        `