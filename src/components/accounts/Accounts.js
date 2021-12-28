import { IconButton } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Card, Divider, Pane, Row, Spacer, Title } from "solid-core/dist/components/styled";
import { initThing } from "solid-core/dist/pods";
import { THEME } from "../../util";
import AccountForm from "./AccountForm";
import { accountStruct } from "./accountStruct";

const Accounts = ({ data }) => {

  const [isAdding, setIsAdding] = useState(false)
  const [accounts, updateAccounts] = useState([])

  useEffect(() => {
    if (data) updateAccounts(data)
  }, [data])

  async function addAccount(acc) {
    debugger
    setIsAdding(false)
    await initThing('account', acc, accountStruct)
    updateAccounts([...accounts, acc])
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
            <Title>{ a.title }</Title>
          ))
        }
      </Card>
    </Pane>
  )
}

export default Accounts;