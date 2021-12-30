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

const Dashboard = ({ user, data }) => {

  const { queue, saveFromQ } = useContext(SaveState);

  const [accounts, setAccounts] = useState([])
  const [buckets, setBuckets] = useState([])

  useEffect(() => {
    if (!data) return;
    loadAccounts(data)
      .then(setAccounts)
    loadBuckets(data)
      .then(setBuckets)
  }, [data])

  async function loadAccounts(things) {
    // GET ALL RECIPE DATA
    return await Promise.all(
      things
        .filter(nameFilter('account'))
        .map(t => loadThing(t.url, accountStruct))
    );
  }

  async function loadBuckets(things) {
    // GET ALL RECIPE DATA
    return await Promise.all(
      things
        .filter(nameFilter('bucket'))
        .map(t => loadThing(t.url, bucketStruct))
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
        <BillSchedule balance={ accounts.find(a => a.primary) } />
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