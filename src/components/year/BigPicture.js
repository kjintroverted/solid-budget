import { useState } from "react"
import { Card, CardHeader, Divider, Pane } from "solid-core/dist/components/styled"
import { getNextPayDate, THEME } from "../../util"

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

const BigPicture = ({ settings, bills }) => {

  const [now] = useState(new Date());

  function getPaydayCount() {
    let counter = {};

    let date = new Date(now.getTime());
    date.setDate(getNextPayDate(new Date(settings.payday), now))

    // GET TO NEXT MONTH
    while (date.getMonth() === now.getMonth()) {
      date.setDate(date.getDate() + 14)
    }

    // CONTINUE FOR 12 MONTHS
    while (date.getMonth() !== now.getMonth()) {
      let m = date.getMonth();
      counter[MONTHS[m]] = counter[MONTHS[m]] ? counter[MONTHS[m]] + 1 : 1;
      date.setDate(date.getDate() + 14)
    }

    return counter;
  }

  return (
    <Pane>
      <Card>
        <CardHeader>BigPicture</CardHeader>
        <Divider theme={ THEME } />
      </Card>
    </Pane>
  )
}

export default BigPicture;