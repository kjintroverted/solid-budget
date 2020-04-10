import React, { useState } from 'react';
import { WidgetContainer, Column, HeaderBar, Spacer, Row } from './theme/ThemeComp'
import { TextField, Button } from '@material-ui/core'
import { amortization } from '../util/helper';

const Loan = () => {

  const [payment, setPayment] = useState(0);
  const [info, setInfo] = useState({
    prin: 0,
    rate: 0,
    years: 0
  });

  function handleChange(field) {
    return e => {
      setInfo({ ...info, [field]: +e.target.value })
    }
  }

  function calculate() {
    let n = info.years * 12;
    let r = info.rate / 12;
    setPayment(amortization(info.prin, r, n))
  }

  return (
    <>
      <WidgetContainer>
        <HeaderBar>
          <h2>Loan Info</h2>
        </HeaderBar>
        <Column align="flex-end">
          <TextField type="number" onChange={ handleChange("prin") } placeholder="Principle   " />
          <TextField type="number" onChange={ handleChange("rate") } placeholder="Interest   " />
          <TextField type="number" onChange={ handleChange("years") } placeholder="Duration   " />
          <Row align="center" w="100%">
            <Spacer />
            <h4>${ payment }</h4>
            <Spacer />
            <Button variant="contained" color="primary" onClick={ calculate }>Calculate</Button>
          </Row>
        </Column>
      </WidgetContainer>
    </>
  )
}

export default Loan;