import { Badge, IconButton } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { Card, Pane, Row, Spacer, Title, CardHeader, Divider, Icon } from "solid-core/dist/components/styled";
import { initThing, setAttr, addToUpdateQueue, SaveState } from "solid-core/dist/pods";
import styled from "styled-components";
import { THEME } from "../../util";
import BalanceInput from "../BalanceInput";
import Buckets from "../buckets/Buckets";
import AccountForm from "./AccountForm";
import { accountStruct } from "./accountStruct";

const Accounts = ({ accountData, bucketData, onUpdate }) => {

  const { queue, updateQueue } = useContext(SaveState);

  const [isAdding, setIsAdding] = useState(false)
  const [accounts, updateAccounts] = useState([])
  const [buckets, updateBuckets] = useState(null)

  useEffect(() => {
    if (accountData) updateAccounts(
      accountData
        .map(a => ({ ...a, details: !!a.details }))
        .sort((a) => a.primary ? -1 : 0))
  }, [accountData])

  useEffect(() => {
    if (bucketData) {
      (function (list) {
        let bucketObject = accountData.reduce(
          (prev, curr) => (
            { ...prev, [curr.title]: list.filter(bucket => bucket.account === curr.title) }
          ), {})
        updateBuckets(bucketObject)
      })(bucketData)
    }
  }, [bucketData, accountData])

  async function addAccount(acc) {
    setIsAdding(false)
    let thing = await initThing('account', acc, accountStruct)
    updateAccounts([...accounts, { ...acc, thing }])
  }

  function updateAccount(acc, field) {
    let i = accounts.findIndex(a => a.thing.url === acc.thing.url)
    return value => {
      let thing = setAttr(acc.thing, accountStruct[field], value)
      if (thing) updateQueue(addToUpdateQueue(queue, thing))
      else thing = acc.thing
      onUpdate({ ...acc, [field]: value, thing })
      updateAccounts([...accounts.slice(0, i), { ...acc, [field]: value, thing }, ...accounts.slice(i + 1)])
    }
  }

  function sortBuckets(list) {
    let bucketObject = accounts.reduce(
      (prev, curr) => (
        { ...prev, [curr.title]: list.filter(bucket => bucket.account === curr.title) }
      ), {})
    updateBuckets(bucketObject)
  }

  function bucketSum(title) {
    if (!buckets || !buckets[title]) return 0;
    return buckets[title].reduce((prev, curr) => +curr.balance + prev, 0)
  }

  return (
    <Pane>
      <Card>
        <Row align="center">
          <CardHeader>Accounts</CardHeader>
          <Spacer />
          <IconButton onClick={ () => setIsAdding(!isAdding) } color="primary">
            <span className="material-icons">{ isAdding ? 'close' : 'add' }</span>
          </IconButton>
        </Row>
        <Divider theme={ THEME } />
        {
          isAdding && <AccountForm onSubmit={ addAccount } />
        }
        {
          accounts.map(a => (
            <span key={ a.thing.url ? a.thing.url : a.title }>
              <Row>
                <Title style={ { margin: 0 } }>{ a.title }</Title>
                {
                  (buckets && buckets[a.title] && !!buckets[a.title].length) &&
                  <Icon theme={ THEME } onClick={ () => updateAccount(a, "details")(!a.details) }>
                    <span className="material-icons">{ a.details ? "expand_less" : "expand_more" }</span>
                  </Icon>
                }
                <Spacer />
                <Badge
                  badgeContent={ +a.balance - bucketSum(a.title) }
                  color="secondary"
                  invisible={ +a.balance - bucketSum(a.title) >= 0 }
                >
                  <BalanceInput
                    onUpdate={ updateAccount(a, 'balance') }
                    value={ a.balance } />
                </Badge>
              </Row>
              {
                (a.details && buckets && buckets[a.title]) &&
                <AccountItem>
                  <p>Available</p>
                  <Spacer />
                  <b>{ +a.balance - buckets[a.title].reduce((prev, curr) => +curr.balance + prev, 0) }</b>
                </AccountItem>
              }
              {
                (a.details && buckets && buckets[a.title]) &&
                buckets[a.title].map(b => (
                  <AccountItem key={ b.thing.url }>
                    <p>{ b.name }</p>
                    <Spacer />
                    <p>{ b.balance }</p>
                  </AccountItem>
                ))
              }
              <Divider thin={ true } theme={ THEME } />
            </span>
          ))
        }
      </Card>
      <Buckets accounts={ accounts } bucketData={ bucketData } onUpdate={ sortBuckets } />
    </Pane >
  )
}

export default Accounts;

const AccountItem = styled.div`
  display: flex;
  align-items: center;
  border-bottom: solid 1px whitesmoke;
`