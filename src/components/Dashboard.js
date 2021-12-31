import { Fab, IconButton } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HeaderBar, SaveButton, Spacer } from "solid-core/dist/components/styled";
import { loadThing, nameFilter, SaveState } from "solid-core/dist/pods";
import styled from "styled-components";
import { THEME } from "../util";
import Accounts from "./accounts/Accounts";
import { accountStruct } from "./accounts/accountStruct";
import { bucketStruct } from "./buckets/bucketStruct";
import BillSchedule from "./schedule/BillSchedule";
import { billStruct } from "./schedule/billStruct";
import { settingsStruct } from "./schedule/settingsStruct";
import BigPicture from "./year/BigPicture";

const Dashboard = ({ user, data }) => {

  const { queue, saveFromQ } = useContext(SaveState);

  const [accounts, setAccounts] = useState([])
  const [buckets, setBuckets] = useState([])
  const [bills, setBills] = useState([])
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    if (!data) return;
    loadAccounts(data)
      .then(setAccounts)
    loadBuckets(data)
      .then(setBuckets)
    loadBills(data)
      .then(setBills)

    let settingsThing = data.find(nameFilter('settings'));
    if (settingsThing) loadThing(settingsThing.url, settingsStruct).then(setSettings)

  }, [data])

  async function loadAccounts(things) {
    // GET ALL ACCOUNT DATA
    return await Promise.all(
      things
        .filter(nameFilter('account'))
        .map(t => loadThing(t.url, accountStruct))
    );
  }

  async function loadBuckets(things) {
    // GET ALL BUCKET DATA
    return await Promise.all(
      things
        .filter(nameFilter('bucket'))
        .map(t => loadThing(t.url, bucketStruct))
    );
  }

  async function loadBills(things) {
    // GET ALL BILL DATA
    return await Promise.all(
      things
        .filter(nameFilter('bill'))
        .map(t => loadThing(t.url, billStruct))
    );
  }

  return (
    <Layout>
      <HeaderBar theme={ THEME }>
        <h2>{ user ? `${ user.firstName }'s` : "My" } Budget</h2>
        <Spacer />
        <Link to="/profile">
          <IconButton color="inherit"><span className="material-icons">person</span></IconButton>
        </Link>
      </HeaderBar>
      <Content>
        <Accounts accountData={ accounts } bucketData={ buckets } />
        <BillSchedule
          account={ accounts.find(a => a.primary) }
          billData={ bills }
          savedSettings={ settings } />
        { settings && <BigPicture bills={ bills } settings={ settings } /> }
      </Content>
      {
        !!queue.length &&
        <SaveButton>
          <Fab
            color="secondary"
            onClick={ saveFromQ }>
            <span className="material-icons">save</span>
          </Fab>
        </SaveButton>
      }
    </Layout>
  )
}

export default Dashboard;

const Layout = styled.div`
  background: ${ THEME.light };
  height: 100%;
  display: grid;
  grid-template-rows: 5.2em 1fr;
  grid-template-areas: 
  "header"
  "main";
  `

const Content = styled.div`
  background: ${ THEME.light };
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  grid-area: main;
`