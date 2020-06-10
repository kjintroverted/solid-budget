import React, { useState } from 'react';
import { Input, IconButton } from '@material-ui/core';
import { Column, Row } from './theme/ThemeComp';

const BucketInput = ({ value, update }) => {
  const [number, setNumber] = useState()

  return (
    <Column align="flex-end" style={ { marginBottom: 15, marginTop: 5 } }>
      <Input
        type='number'
        placeholder="0"
        value={ value }
        onChange={ e => update(+e.target.value) }
      />
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
          value={ number || 0 }
          onChange={ e => setNumber(+e.target.value) }
        />
      </Row>
    </Column>
  )
}

export default BucketInput;