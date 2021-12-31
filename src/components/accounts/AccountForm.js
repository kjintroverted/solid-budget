import { Button, Checkbox, FormControlLabel, FormGroup, Input } from "@material-ui/core"
import { useState } from "react";
import { Column, Row } from "solid-core/dist/components/styled";

const AccountForm = ({ onSubmit }) => {

  const [account, updateAccount] = useState({});

  function handleChange(field) {
    return e => {
      updateAccount({ ...account, [field]: e.target.value })
    }
  }

  function togglePrimary(e) {
    updateAccount({ ...account, primary: e.target.checked })
  }

  return (
    <Column>
      <Row>
        <Input onChange={ handleChange("title") } style={ { flex: 2 } } placeholder="title" />
        <Input onChange={ handleChange("balance") } style={ { flex: 1 } } type="number" placeholder="balance" />
      </Row>
      <FormGroup>
        <FormControlLabel control={ <Checkbox onChange={ togglePrimary } color="secondary" /> } label="Primary" />
      </FormGroup>
      <Button onClick={ () => onSubmit(account) } variant="outlined" color="secondary">Add</Button>
    </Column>
  )
}

export default AccountForm;