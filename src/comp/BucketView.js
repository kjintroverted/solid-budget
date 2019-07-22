import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TopAnchor } from './theme/ThemeComp';
import { Fab } from '@material-ui/core';
import BucketForm from './forms/BucketForm';
import Bucket from './Bucket';


export default ({ bucketList, accountList, save }) => {
  let [buckets, updateBuckets] = useState(bucketList);
  let [isAdding, setAdding] = useState(false);

  function getAccountLabels() {
    return accountList.reduce((arr, account) => arr.indexOf(account.label) !== -1 ? arr : [...arr, account.label], [])
  }

  function addBucket(data) {
    data = { ...data, value: 0, debits: [] };
    updateBuckets([...buckets, data]);
    setAdding(false);
  }

  function updateBucket(i) {
    return data => {
      updateBuckets([...buckets.slice(0, i), data, ...buckets.slice(i + 1)]);
    }
  }

  function deleteBucket(i) {
    return () => {
      updateBuckets([...buckets.slice(0, i), ...buckets.slice(i + 1)]);
    }
  }

  useEffect(() => {
    if (!buckets) return;
    save(buckets);
  }, [buckets])

  useEffect(() => {
    updateBuckets(bucketList)
  }, [bucketList]);

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
      {
        isAdding &&
        <BucketForm submit={ addBucket } labels={ getAccountLabels() } />
      }
      {
        buckets &&
        buckets.map((b, i) => <Bucket bucket={ b } update={ updateBucket(i) } onDelete={ deleteBucket(i) } />)
      }
    </BucketContainer>
  )
}

const BucketContainer = styled.div`
  position: relative;
`