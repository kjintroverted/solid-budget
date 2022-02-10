import { Button, FormControl, Input, InputLabel, MenuItem, Select } from "@material-ui/core"
import { useContext, useState } from "react";
import { Column, Divider, CardHeader, Spacer } from "solid-core/dist/components/styled";
import { AppTheme } from "../../util";

const ACTION_TYPES = {
  NONE: "NONE",
  UPDATE: "UPDATE",
  TRANSFER: "TRANSFER"
}

const NoteForm = ({ onSubmit }) => {

  const THEME = useContext(AppTheme)
  const [note, updateNote] = useState({ actionType: ACTION_TYPES.NONE });

  function handleChange(field) {
    return e => {
      updateNote({ ...note, [field]: e.target.value })
    }
  }

  return (
    <Column width="95%">
      <CardHeader>New Note</CardHeader>
      <Divider theme={ THEME } />
      <Input onChange={ handleChange("text") } placeholder="Take a note." />
      <Spacer height="1em" />
      <FormControl>
        <InputLabel>Action</InputLabel>
        <Select value={ note.actionType } label="Action" onChange={ handleChange("actionType") }>
          {
            Object.entries(ACTION_TYPES).map(([_, value]) => <MenuItem key={ value } value={ value }>{ value }</MenuItem>)
          }
        </Select>
      </FormControl>
      <Spacer height="1em" />
      <Button onClick={ () => onSubmit(note) } variant="outlined" color="secondary">Add</Button>
    </Column>
  )
}

export default NoteForm;