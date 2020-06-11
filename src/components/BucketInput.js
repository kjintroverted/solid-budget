import React, { useState } from 'react';
import { Input, IconButton } from '@material-ui/core';
import { Column, Row } from './theme/ThemeComp';

const BucketInput = ({ value, update }) => {
  const [number, setNumber] = useState()
  const [expand, setExpand] = useState(false)

  return (
    <Column align="flex-end" style={ { marginBottom: 15, marginTop: 5 } }>
      <Row>
        <Input
          type='number'
          placeholder="0"
          value={ value }
          onChange={ e => update(+e.target.value) }
        />
        <IconButton size="small" color="default"
          onClick={ () => setExpand(!expand) }
        >
          <i className="material-icons">{ expand ? "cancel_presentation" : "calculate" }</i>
        </IconButton>
      </Row>
      { expand &&
        <Row>
          <IconButton size="small" color="primary"
            onClick={ () => {
              update(value + number)
              setNumber(0)
            } }
          >
            <i className="material-icons">add</i>
          </IconButton>
          <input
            minor="true"
            type='number'
            value={ number || '' }
            onChange={ e => setNumber(+e.target.value) }
          />
          <IconButton size="small" color="primary"
            onClick={ () => {
              update(value - number)
              setNumber(0)
            } }
          >
            <i className="material-icons">remove</i>
          </IconButton>
        </Row>
      }
    </Column>
  )
}

export default BucketInput;