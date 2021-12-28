import { Fab, IconButton } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HeaderBar, SaveButton, Spacer } from "solid-core/dist/components/styled";
import { loadThing, nameFilter, SaveState } from "solid-core/dist/pods";
import styled from "styled-components";
import { THEME } from "../util";
import Accounts from "./accounts/Accounts";
import { accountStruct } from "./accounts/accountStruct";

const Dashboard = ({ user, data }) => {

  const { queue, saveFromQ } = useContext(SaveState);

  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    if (!data) return;
    loadAccounts(data)
      .then(setAccounts)
  }, [data])

  async function loadAccounts(things) {
    // GET ALL RECIPE DATA
    return await Promise.all(
      things
        .filter(nameFilter('account'))
        .map(t => loadThing(t.url, accountStruct))
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
        <Accounts data={ accounts } />
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
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  grid-area: main;
`