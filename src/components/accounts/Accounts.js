import { IconButton } from "@material-ui/core";
import { useState } from "react";
import { Card, Divider, Pane, Row, Spacer } from "solid-core/dist/components/styled";
import { THEME } from "../../util";
import AccountForm from "./AccountForm";

const Accounts = ({ accounts }) => {

  const [isAdding, setIsAdding] = useState(false)

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
          isAdding && <AccountForm />
        }
      </Card>
    </Pane>
  )
}

export default Accounts;