import React from 'react';
import styled from 'styled-components';
import { WidgetContainer, HeaderBar, Row, Spacer, IndentRow, Info } from './theme/ThemeComp';
import { months, totalCredit, totalDebitForMonth, round } from '../util/helper';
import { Divider } from '@material-ui/core';

export default ({ bills, settings }) => {

  function getExtraBills(month) {
    return bills.reduce((arr, bill) => {
      if (!bill.months || bill.months.indexOf(month) === -1) return arr;
      return [...arr, (
        <IndentRow key={ `extra-bill-${ bill.title }` }>
          <Debit>{ bill.title }</Debit>
          <Spacer />
          <Debit>{ bill.payment }</Debit>
        </IndentRow>
      )]
    }, [])
  }

  function createMonthViews() {
    let now = new Date();
    let [month, year] = nextMonth(now.getMonth() + 1, now.getFullYear());
    let views = [];
    let totalIncome = 0;
    let totalDebit = 0;
    do {
      const credit = totalCredit(settings.paycheck, new Date(settings.payDate), month, year);
      totalIncome += credit;
      const debit = totalDebitForMonth(bills, month);
      totalDebit += debit;
      views.push(
        <MonthView key={ `month-${ month }` }>
          <Row>
            <h3>{ months[month - 1] }</h3>
            <Spacer />
            <h3>{ credit - debit }</h3>
          </Row>
          <Row>
            <p>Income</p>
            <Spacer />
            <Credit>{ credit }</Credit>
          </Row>
          <Row>
            <p>Debit</p>
            <Spacer />
            <Debit>({ debit })</Debit>
          </Row>
          {
            getExtraBills(month)
          }
          <Divider />
        </MonthView>
      );
      ([month, year] = nextMonth(month, year));
    } while (month !== now.getMonth() + 1)

    views.push(
      <Info key="year-summary">
        <i>Total Income: <strong>{ totalIncome }</strong></i>
        <i>Total Debit: <strong>{ totalDebit }</strong></i>
        <i>Munny with a Job: <strong>{ round((totalDebit / totalIncome) * 100, 2) }%</strong></i>
      </Info>
    )
    return views;
  }

  return (
    <WidgetContainer>
      <HeaderBar>
        <h2>Big Picture</h2>
      </HeaderBar>
      { settings && bills && createMonthViews() }
    </WidgetContainer>
  )
}

const MonthView = styled.div`
  p {
    margin: 5px 0px;
  }
`

const Debit = styled.p`
  color: red;
`
const Credit = styled.p`
  color: green;
`

function nextMonth(m, y) {
  return ++m > 12 ? [1, y + 1] : [m, y];
}