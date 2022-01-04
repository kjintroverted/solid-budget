import { useState } from "react"
import { Card, CardHeader, Column, Divider, Icon, Pane, Row, Spacer, Title } from "solid-core/dist/components/styled"
import styled from "styled-components"
import { getDebitBefore, getNextPayDate, THEME, Credit, Debit, Info } from "../../util"

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

const BigPicture = ({ settings, bills }) => {

  const [now] = useState(new Date());

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
      <>
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
            <h3>{ credit - debit }</h3>
            <Credit>{ credit }</Credit>
            <Debit>({ debit })</Debit>
          </Column>
        </Row>
        <Divider theme={ THEME } />
      </>
      ]
      month = month >= 11 ? 0 : month + 1;
    }
    return [
      readout,
      <Info>
        <Icon className="material-icons">info</Icon>
        Money with a Job: <b>{ Math.round((totalDebit / totalCredit) * 100) }%</b>
      </Info>
    ]
  }

  return (
    <Pane>
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