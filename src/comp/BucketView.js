import React, { useState } from 'react';
import styled from 'styled-components';
import { TopAnchor } from './theme/ThemeComp';
import { Fab } from '@material-ui/core';

export default ({ bucketsList, update }) => {
  let [buckets, updateBuckets] = useState(bucketsList);
  let [isAdding, setAdding] = useState(false);
  return (
    <BucketContainer>
      <TopAnchor>
        <Fab onClick={ () => setAdding(!isAdding) }
          color="secondary" size="small"
          style={ { color: 'white' } }
        >
          <i className="material-icons">{ isAdding ? 'close' : 'add' }</i>
        </Fab>
      </TopAnchor>
    </BucketContainer>
  )
}

const BucketContainer = styled.div`
  position: relative;
`