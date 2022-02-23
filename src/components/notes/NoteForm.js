import { Button, FormControl, Input, InputLabel, MenuItem, Select } from "@material-ui/core"
import { useContext, useEffect, useState } from "react";
import { Column, Divider, CardHeader, Spacer, Row } from "solid-core/dist/components/styled";
import { loadAllByName } from "solid-core/dist/pods";
import { AppTheme } from "../../util";
import { accountStruct } from "../accounts/accountStruct";
import { bucketStruct } from "../buckets/bucketStruct";

export const ACTION_TYPES = {
  NONE: "NONE",
  UPDATE: "UPDATE",
  TRANSFER: "TRANSFER"
}

const NoteForm = ({ dataset, onSubmit }) => {

  const THEME = useContext(AppTheme)
  const [note, updateNote] = useState({ actionType: ACTION_TYPES.NONE });
  const [accounts, updateAccounts] = useState([]);

  useEffect(() => {
    if (!dataset) return
    let bank = loadAllByName(dataset, 'account', accountStruct);
    let buckets = loadAllByName(dataset, 'bucket', bucketStruct);
    updateAccounts([...bank, ...buckets])
  }, [dataset])

  function handleChange(field, numeric) {
    return e => {
      updateNote({ ...note, [field]: numeric ? +e.target.value : e.target.value })
    }
  }

  return (
    <Column width='95%'>
      <CardHeader>New Note</CardHeader>
      <Divider theme={ THEME } />
      <Input onChange={ handleChange("text") } placeholder="Take a note." />
      <Row>
        <FormControl>
          <InputLabel>Action</InputLabel>
          <Select value={ note.actionType } label="Action" onChange={ handleChange("actionType") }>
            {
              Object.entries(ACTION_TYPES).map(([_, value]) => <MenuItem key={ value } value={ value }>{ value }</MenuItem>)
            }
          </Select>
        </FormControl>
        <Spacer />
        {
          note.actionType !== ACTION_TYPES.NONE &&
          <Input onChange={ handleChange('value', true) } type="number" placeholder="value" />
        }
      </Row>
      {
        note.actionType !== ACTION_TYPES.NONE
        &&
        <Row>
          <FormControl fullWidth>
            <InputLabel>Account</InputLabel>
            <Select value={ note.account || "" } label="Account" onChange={ handleChange('account') }>
              {
                accounts.map((a) => <MenuItem key={ a.thing.url } value={ a.thing.url }>{ a.title || a.name }</MenuItem>)
              }
            </Select>
          </FormControl>
          {
            note.actionType === ACTION_TYPES.TRANSFER
            &&
            <FormControl fullWidth>
              <InputLabel>Account</InputLabel>
              <Select value={ note.target || "" } label="Target" onChange={ handleChange('target') }>
                {
                  accounts.map((a) => <MenuItem key={ a.thing.url } value={ a.thing.url }>{ a.title || a.name }</MenuItem>)
                }
              </Select>
            </FormControl>
          }
        </Row>
      }
      <Spacer height='1em' />
      <Button onClick={ () => onSubmit(note) } variant="outlined" color="secondary">Add</Button>
      <Spacer height='.5em' />
    </Column>
  )
}

export default NoteForm;