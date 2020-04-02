import React from 'react';
import styled from 'styled-components';
import { day } from '../util/helper';
import { RowCenter } from './theme/ThemeComp';

const Warning = ({ lastUpdated = new Date(0) }) => {
  const now = new Date()

  if (now - lastUpdated < day * 2) {
    let Bar = appBar("green");
    return (
      <Bar>
        <RowCenter>
          <i style={ { margin: "0px 5px" } } class="material-icons">check</i>
          <p>
            Budget is up to date.
          </p>
        </RowCenter>
      </Bar>
    )
  }

  let Bar = appBar(now - lastUpdated > day * 5 ? 'red' : 'orange')

  return (
    <Bar>
      <RowCenter>
        <i style={ { margin: "0px 5px" } } class="material-icons">warning</i>
        <p>
          Info displayed may be out dated. Last updated { Math.floor((now - lastUpdated) / day) } days ago.
        </p>
      </RowCenter>
    </Bar>
  )
}

export default Warning;

function appBar(color) {
  return styled.div`
  width: 100vw;
  padding: 0px 5px;
  background: ${color };
  color: white;
`
}