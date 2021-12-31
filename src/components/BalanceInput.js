import { Input } from "@material-ui/core";
import { useState } from "react";
import { Column, Row, Icon } from "solid-core/dist/components/styled"
import styled from "styled-components";
import { THEME } from "../util"

const BalanceInput = ({ value, onUpdate }) => {

  const [expand, setExpand] = useState(false)
  const [n, setN] = useState(0)

  function calc(mult) {
    return () => {
      onUpdate(+value + (+n * mult));
      setN(0)
    }
  }

  return (
    <Column>
      <Row justify="flex-end" align="center">
        <Input
          value={ value || 0 }
          onChange={ e => onUpdate(e.target.value) }
          style={ { width: "7em" } }
          type="number"
          startAdornment={
            <Icon theme={ THEME } onClick={ () => setExpand(!expand) } className="material-icons">calculate</Icon>
          }
          placeholder="balance" />
      </Row>
      {
        expand &&
        <Row align="center" justify="flex-end">
          <Icon onClick={ calc(1) } className="material-icons">add</Icon>
          <HelperInput value={ n } onChange={ e => setN(e.target.value) } type="number" />
          <Icon theme={ THEME } onClick={ calc(-1) } className="material-icons">remove</Icon>
        </Row>
      }
    </Column>
  )
}

export default BalanceInput;

const HelperInput = styled.input`
  border: none;
  background: whitesmoke;
  border-radius: 5px;
  width: 50px;
  margin: 10px 0px;
  padding: 5px;
  font-size: .7em;
`