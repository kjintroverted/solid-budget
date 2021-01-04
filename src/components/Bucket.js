import React, { useState } from 'react';
import { WidgetContainer, HeaderBar, Spacer, ActionBar, Row, Column } from './theme/ThemeComp';
import { Badge, IconButton } from '@material-ui/core';
import BucketInput from './BucketInput';
import BucketForm from './forms/BucketForm';

export default ({ bucket, update, onDelete }) => {

  let [adding, setAdding] = useState(false)

  function handleChange(field) {
    return val => {
      update({ ...bucket, [field]: val });
    }
  }

  function handleCupChange(i) {
    return val => {
      let updatedCups = [...bucket.cups.slice(0, i), { ...bucket.cups[i], value: val }, ...bucket.cups.slice(i + 1)]
      update({ ...bucket, cups: updatedCups });
    }
  }

  function removeCup(i) {
    return () => {
      let updatedCups = [...bucket.cups.slice(0, i), ...bucket.cups.slice(i + 1)]
      update({ ...bucket, cups: updatedCups });
    }
  }

  function addCup(data) {
    if (!bucket.cups) {
      bucket.cups = [];
    }
    update({ ...bucket, cups: [...bucket.cups, { ...data, value: 0 }] });
    setAdding(false)
  }

  return (
    <WidgetContainer>
      <HeaderBar>
        <Column>
          <h2>{ bucket.name }</h2>
          <p>{ bucket.label }</p>
        </Column>
        <Spacer />
        <ActionBar>
          <IconButton color="primary" onClick={ () => update({ ...bucket, favorite: !bucket.favorite }) }>
            <i className="material-icons">{ bucket.favorite ? 'star' : 'star_border' }</i>
          </IconButton>
          <IconButton color="primary" onClick={ () => setAdding(!adding) }>
            <i className="material-icons">{ adding ? 'close' : 'add' }</i>
          </IconButton>
          <IconButton onClick={ onDelete } >
            <i className="material-icons">delete</i>
          </IconButton>
        </ActionBar>
      </HeaderBar>
      <Row>
        <Spacer />
        <Badge
          color="primary"
          badgeContent={ bucket.cups ? bucket.value - bucket.cups.reduce((acc, { value }) => acc + value, 0) : NaN }
          max={ 999 }
          invisible={ !bucket.cups || !bucket.cups.length }
        >
          <BucketInput value={ bucket.value } update={ handleChange('value') } />
        </Badge>
      </Row>
      { adding && <BucketForm submit={ addCup } labels={ [bucket.name] } /> }
      {
        (bucket.cups && !!bucket.cups.length)
        && bucket.cups.map((cup, i) => {
          return (
            <Row>
              <IconButton color="secondary" onClick={ removeCup(i) }>
                <i className="material-icons">close</i>
              </IconButton>
              <p>{ cup.name }</p>
              <Spacer />
              <BucketInput value={ cup.value } update={ handleCupChange(i) } />
            </Row>
          )
        })
      }
    </WidgetContainer>
  )
}