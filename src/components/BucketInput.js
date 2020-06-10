import React from 'react';
import { Input } from '@material-ui/core';

const BucketInput = ({ value, update }) => {
  console.log(update);

  return (
    <Input
      type='number'
      placeholder="0"
      value={ value }
      onChange={ e => update(+e.target.value) }
    />
  )
}

export default BucketInput;