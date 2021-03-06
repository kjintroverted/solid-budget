import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Column, HeaderBar, Spacer, LoadingContainer } from "../components/theme/ThemeComp";
import { Fab, CircularProgress } from "@material-ui/core";
import BucketForm from "../components/forms/BucketForm";
import Bucket from "../components/Bucket";

export default ({ bucketList, accountList, onUpdate, onDelete }) => {
  let [buckets, updateBuckets] = useState(bucketList);
  let [isAdding, setAdding] = useState(false);

  function getAccountLabels() {
    return accountList.reduce(
      (arr, account) =>
        arr.indexOf(account.label) !== -1 ? arr : [...arr, account.label],
      []
    );
  }

  function addBucket(data) {
    data = { ...data, value: 0, debits: [], cups: [] };
    updateBuckets([data, ...buckets]);
    setAdding(false);
  }

  function updateBucket(i) {
    return data => {
      updateBuckets([...buckets.slice(0, i), data, ...buckets.slice(i + 1)]);
    };
  }

  function deleteBucket(i) {
    return () => {
      onDelete(buckets[i]);
      updateBuckets([...buckets.slice(0, i), ...buckets.slice(i + 1)]);
    };
  }

  useEffect(() => {
    if (!buckets) return;
    buckets.sort((a, b) => {
      if (a.favorite) {
        if (!b.favorite) return -1;
      } else if (b.favorite) return 1;
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
    onUpdate(buckets);
  }, [buckets, onUpdate]);

  useEffect(() => {
    updateBuckets(bucketList);
  }, [bucketList]);

  return (
    <BucketContainer>
      <HeaderBar>
        <Column>
          <h2>Buckets</h2>
          <p>Money set aside for a purpose.</p>
        </Column>
        <Spacer />
        <Fab
          onClick={ () => setAdding(!isAdding) }
          color='secondary'
          size='small'
          style={ { color: "white" } }
          disabled={ !buckets }
        >
          <i className='material-icons'>{ isAdding ? "close" : "add" }</i>
        </Fab>
      </HeaderBar>
      { isAdding && (
        <BucketForm submit={ addBucket } labels={ getAccountLabels() } />
      ) }

      { !buckets && <LoadingContainer><CircularProgress /></LoadingContainer> }

      { buckets &&
        buckets.map((b, i) => (
          <Bucket
            key={ `bucket-${ b.name }` }
            bucket={ b }
            update={ updateBucket(i) }
            onDelete={ deleteBucket(i) }
          />
        )) }
    </BucketContainer>
  );
};

const BucketContainer = styled.div`
  position: relative;
`;
