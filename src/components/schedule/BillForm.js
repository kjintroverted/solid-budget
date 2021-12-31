import { Button, Checkbox, FormControlLabel, FormGroup, Input } from "@material-ui/core"
import { useState } from "react";
import { Column, Row } from "solid-core/dist/components/styled";

const BillForm = ({ onSubmit }) => {

  const [bill, updateBill] = useState({});
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
    if (e.target.checked) updateBill({ ...bill, month: "" })
  }

  return (
    <Column>
      <Row>
        <Input onChange={ handleChange("title") } style={ { flex: 2 } } placeholder="title" />
        <Input onChange={ handleChange("debit") } style={ { flex: 1 } } type="number" placeholder="debit" />
      </Row>
      <Row align="center">
        <Input
          disabled={ monthly }
          onChange={ handleChange("month", 1, 12) }
          type="number"
          placeholder="month" />
        /
        <Input
          onChange={ handleChange("date", 1, 28) }
          type="number"
          placeholder="date" />
      </Row>
      <FormGroup>
        <FormControlLabel checked={ monthly } control={ <Checkbox onChange={ toggleMonthly } color="secondary" /> } label="Monthly" />
      </FormGroup>
      <Button onClick={ () => onSubmit(bill) } variant="outlined" color="secondary">Add</Button>
    </Column>
  )
}

export default BillForm;