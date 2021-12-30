import { IconButton } from "@material-ui/core";
import { useState } from "react";
import { Card, CardHeader, Divider, Pane, Row, Spacer } from "solid-core/dist/components/styled"
import { initThing } from "solid-core/dist/pods";
import { THEME } from "../../util"
import BillForm from "./BillForm";
import { billStruct } from "./billStruct";

const BillSchedule = ({ billData, balance }) => {

  const [isAdding, setIsAdding] = useState(false)
  const [bills, updateBills] = useState([]);

  async function addBill(bill) {
    setIsAdding(false)
    let thing = await initThing('bill', bill, billStruct)
    updateBills(
      [...bills, { ...bill, thing }]
        .sort((a, b) => +a.date - +b.date)
    )
  }

  return (
    <Pane>
      <Card>
        <Row align="center">
          <CardHeader>Bill Schedule</CardHeader>
          <Spacer />
          <IconButton onClick={ () => setIsAdding(!isAdding) } color="primary">
            <span className="material-icons">{ isAdding ? 'close' : 'add' }</span>
          </IconButton>
        </Row>
        <Divider theme={ THEME } />
        {
          isAdding &&
          <BillForm onSubmit={ addBill } />
        }
      </Card>
    </Pane>
  )
}

export default BillSchedule;