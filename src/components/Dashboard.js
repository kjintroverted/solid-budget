import { IconButton } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SaveButton from "solid-core/dist/components/SaveButton";
import { HeaderBar, Spacer } from "solid-core/dist/components/styled";
import { loadAllByName, loadByName, SaveState } from "solid-core/dist/pods";
import styled from "styled-components";
import { AppTheme, THEME } from "../util";
import Accounts from "./accounts/Accounts";
import { accountStruct } from "./accounts/accountStruct";
import { bucketStruct } from "./buckets/bucketStruct";
import Notes from "./notes/Notes";
import BillSchedule from "./schedule/BillSchedule";
import { billStruct } from "./schedule/billStruct";
import { settingsStruct } from "./schedule/settingsStruct";
import BigPicture from "./year/BigPicture";

const Dashboard = ({ user, data }) => {

  const { queue, saveFromQ } = useContext(SaveState);
  const { mui } = useContext(AppTheme);

  const [accounts, setAccounts] = useState([])
  const [buckets, setBuckets] = useState([])
  const [bills, setBills] = useState([])
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    if (!data) return;
    setAccounts(loadAllByName(data, 'account', accountStruct))
    setBuckets(loadAllByName(data, 'bucket', bucketStruct))
    setBills(loadAllByName(data, 'bill', billStruct))
    setSettings(loadByName(data, 'settings', settingsStruct))
  }, [data])

  function updateAccount(acc) {
    let i = accounts.findIndex(a => a.thing.url === acc.thing.url)
    setAccounts([...accounts.slice(0, i), acc, ...accounts.slice(i + 1)])
  }

  return (
    <Layout>
      <HeaderBar theme={ THEME }>
        <h2>{ user ? `${ user.name }'s` : "My" } Budget</h2>
        <Spacer />
        <Link to="/profile">
          <IconButton color="inherit"><span className="material-icons">person</span></IconButton>
        </Link>
      </HeaderBar>
      <Content>
        <Accounts accountData={ accounts } bucketData={ buckets } onUpdate={ updateAccount } />
        <BillSchedule
          account={ accounts.find(a => a.primary) }
          billData={ bills }
          savedSettings={ settings } />
        { settings && <BigPicture bills={ bills } settings={ settings } /> }
        <Notes />
      </Content>
      <SaveButton ui={ mui } save={ saveFromQ } queue={ queue } />
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
  justify-content: center;
  flex-wrap: wrap;
  grid-area: main;
`