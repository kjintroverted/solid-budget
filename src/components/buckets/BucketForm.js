import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, Input, InputLabel, MenuItem, Select } from "@material-ui/core"
import { useContext, useState } from "react";
import { Column, Divider, Row } from "solid-core/dist/components/styled";
import { AppTheme, CardHeader } from "../../util";

const BucketForm = ({ accounts, onSubmit }) => {

  const THEME = useContext(AppTheme)
  const [bucket, updateBucket] = useState({});

  function handleChange(field) {
    return e => {
      updateBucket({ ...bucket, [field]: e.target.value })
    }
  }

  function togglePinned(e) {
    updateBucket({ ...bucket, pinned: e.target.checked })
  }

  return (
    <Column>
      <CardHeader>New Bucket</CardHeader>
      <Divider theme={ THEME } />
      <Row>
        <Input onChange={ handleChange("name") } style={ { flex: 2 } } placeholder="name" />
        <Input onChange={ handleChange("balance") } style={ { flex: 1 } } type="number" placeholder="balance" />
      </Row>
      <FormControl fullWidth>
        <InputLabel>Account</InputLabel>
        <Select value={ bucket.account || "" } label="Account" onChange={ handleChange("account") }>
          {
            accounts.map(({ title }) => <MenuItem key={ title } value={ title }>{ title }</MenuItem>)
          }
        </Select>
      </FormControl>
      <FormGroup>
        <FormControlLabel control={ <Checkbox onChange={ togglePinned } color="secondary" /> } label="Pinned" />
      </FormGroup>
      <Button onClick={ () => onSubmit(bucket) } variant="outlined" color="secondary">Add</Button>
    </Column>
  )
}

export default BucketForm;