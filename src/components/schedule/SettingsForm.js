import { Button, Input } from "@material-ui/core"
import { useEffect, useState } from "react";
import { Column, Row, Spacer } from "solid-core/dist/components/styled";

const SettingsForm = ({ onSubmit, savedSettings }) => {

  const [settings, updateSettings] = useState({});

  useEffect(() => {
    if (savedSettings) updateSettings(savedSettings)
  }, [savedSettings])

  function handleChange(field) {
    return e => {
      let value = e.target.value;
      updateSettings({ ...settings, [field]: value })
    }
  }

  return (
    <Column>
      <Row>
        <Input
          value={ settings.payday || "" }
          style={ { flex: "2" } }
          onChange={ handleChange("payday") }
          placeholder="past payday (mm/dd/yyyy)" />
        <Spacer width='1em' />
        <Input
          value={ settings.paycheck || "" }
          style={ { flex: "1" } }
          onChange={ handleChange("paycheck") }
          type="number"
          placeholder="paycheck" />
      </Row>
      <Button style={ { marginTop: "1em" } } onClick={ () => onSubmit(settings) } variant="outlined" color="secondary">Save</Button>
    </Column>
  )
}

export default SettingsForm;