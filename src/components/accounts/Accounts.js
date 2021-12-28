import { IconButton, Input } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { Card, Pane, Row, Spacer, Title } from "solid-core/dist/components/styled";
import { initThing, setAttr, addToUpdateQueue, SaveState } from "solid-core/dist/pods";
import { Divider, THEME } from "../../util";
import AccountForm from "./AccountForm";
import { accountStruct } from "./accountStruct";

const Accounts = ({ data }) => {

  const { queue, updateQueue } = useContext(SaveState);

  const [isAdding, setIsAdding] = useState(false)
  const [accounts, updateAccounts] = useState([])

  useEffect(() => {
    if (data) {
      updateAccounts(data.sort((a) => a.primary ? -1 : 0))
    }
  }, [data])

  async function addAccount(acc) {
    setIsAdding(false)
    await initThing('account', acc, accountStruct)
    updateAccounts([...accounts, acc])
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
          <h3 style={ { margin: 0 } } theme={ THEME }>Accounts</h3>
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
            <>
              <Row key={ a.thing.url ? a.thing.url : a.title }>
                <Title style={ { margin: 0 } }>{ a.title }</Title>
                <Spacer />
                <Input
                  onChange={ updateAccount(a, 'balance') }
                  style={ { width: '6em' } }
                  type="number"
                  value={ a.balance } />
              </Row>
              <Divider thin={ true } theme={ THEME } />
            </>
          ))
        }
      </Card>
    </Pane>
  )
}

export default Accounts;