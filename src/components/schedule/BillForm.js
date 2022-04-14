import { Button, Checkbox, FormControlLabel, Input } from "@material-ui/core"
import { useState } from "react";
import { Column, Row, Spacer } from "solid-core/dist/components/styled";

const Months = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec'
]

const BillForm = ({ onSubmit }) => {

  const [bill, updateBill] = useState({ month: [] });
  const [monthly, setMonthly] = useState(true);

  function handleChange(field, min, max) {
    return e => {
      let value = e.target.value;
      if (max || min) value = +value > max ? max : +value < min ? min : value;
      updateBill({ ...bill, [field]: value })
    }
  }

  function toggleMonthly(e) {
    setMonthly(e.target.checked)
    if (e.target.checked) updateBill({ ...bill, month: [] })
  }

  function toggleMonth(m) {
    return () => {
      let month = [...bill.month]
      let i = month.indexOf(m);
      if (i >= 0) {
        updateBill({ ...bill, month: [...month.slice(0, i), ...month.slice(i + 1)] })
      } else {
        updateBill({ ...bill, month: [...month, m] })
      }
    }
  }

  return (
    <Column>
      <Row>
        <Input onChange={ handleChange("title") } style={ { flex: 2 } } placeholder="title" />
        <Input onChange={ handleChange("debit") } style={ { flex: 1 } } type="number" placeholder="debit" />
      </Row>
      <Row align="center">
        <Spacer />
        <Input
          onChange={ handleChange("date", 1, 28) }
          type="number"
          placeholder="date" />
      </Row>
      <FormControlLabel checked={ monthly } control={ <Checkbox onChange={ toggleMonthly } color="secondary" /> } label="Monthly" />
      {
        !monthly &&
        <Column>
          {
            Months.map((m, i) => <FormControlLabel control={ <Checkbox onChange={ toggleMonth(i + 1) } color="primary" /> } label={ m } />)
          }

        </Column>
      }
      <Button onClick={ () => onSubmit(bill) } variant="outlined" color="secondary">Add</Button>
    </Column>
  )
}

export default BillForm;