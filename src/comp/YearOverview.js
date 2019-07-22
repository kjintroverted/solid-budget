import React from 'react';
import styled from 'styled-components';
import { WidgetContainer, HeaderBar, Row, Spacer } from './theme/ThemeComp';
import { months, totalCredit, totalDebit } from '../util/helper';
import { Divider } from '@material-ui/core';

export default ({ bills, settings }) => {

  function createMonthViews() {
    let now = new Date();
    let [month, year] = nextMonth(now.getMonth() + 1, now.getFullYear());
    let views = [];
    do {
      views.push(
        <div key={ `month-${ month }` }>
          <Row>
            <h3>{ months[month - 1] }</h3>
          </Row>
          <Row>
            <p>Income</p>
            <Spacer />
            <p>{ totalCredit(settings.paycheck, new Date(settings.payDate), month, year) }</p>
          </Row>
          <Row>
            <p>Debit</p>
            <Spacer />
            <Debit>({ totalDebit(bills, month) })</Debit>
          </Row>
          <Divider />
        </div>
      );
      ([month, year] = nextMonth(month, year));
    } while (month != now.getMonth() + 1)
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

const Debit = styled.p`
  color: red;
`

function nextMonth(m, y) {
  return ++m > 12 ? [1, y + 1] : [m, y];
}