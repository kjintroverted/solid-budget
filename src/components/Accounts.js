import { Card, Divider, Pane } from "solid-core/dist/components/styled";
import { THEME } from "../App";

const Accounts = ({ accounts }) => {
  return (
    <Pane>
      <Card>
        <h3 style={ { margin: 0 } } theme={ THEME }>Accounts</h3>
        <Divider theme={ THEME } />
      </Card>
    </Pane>
  )
}

export default Accounts;