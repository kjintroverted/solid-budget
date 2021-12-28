import { IconButton, Input } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { Card, Pane, Row, Spacer, Title } from "solid-core/dist/components/styled";
import { initThing, setAttr, addToUpdateQueue, SaveState } from "solid-core/dist/pods";
import { CardHeader, Divider, THEME } from "../../util";
import Buckets from "../buckets/Buckets";
import AccountForm from "./AccountForm";
import { accountStruct } from "./accountStruct";

const Accounts = ({ accountData, bucketData }) => {

  const { queue, updateQueue } = useContext(SaveState);

  const [isAdding, setIsAdding] = useState(false)
  const [accounts, updateAccounts] = useState([])

  useEffect(() => {
    if (accountData) updateAccounts(accountData.sort((a) => a.primary ? -1 : 0))
  }, [accountData])

  async function addAccount(acc) {
    setIsAdding(false)
    let thing = await initThing('account', acc, accountStruct)
    updateAccounts([...accounts, { ...acc, thing }])
  }

  function updateAccount(acc, field) {
    let i = accounts.findIndex(a => a.thing.url === acc.thing.url)
    return e => {
      let t = setAttr(acc.thing, accountStruct[field], e.target.value)
      updateQueue(addToUpdateQueue(queue, t))
      updateAccounts([...accounts.slice(0, i), { ...acc, [field]: e.target.value, thing: t }, ...accounts.slice(i + 1)])
    }
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
                <Spacer />
                <Input
                  onChange={ updateAccount(a, 'balance') }
                  style={ { width: '6em' } }
                  type="number"
                  value={ a.balance } />
              </Row>
              <Divider thin={ true } theme={ THEME } />
            </span>
          ))
        }
      </Card>
      <Buckets accounts={ accounts } bucketData={ bucketData } />
    </Pane>
  )
}

export default Accounts;