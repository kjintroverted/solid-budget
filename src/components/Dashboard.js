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
import BillSchedule from "./schedule/BillSchedule";
import { billStruct } from "./schedule/billStruct";
import { settingsStruct } from "./schedule/settingsStruct";
import BigPicture from "./year/BigPicture";

const Dashboard = ({ user }) => {

  const { queue, saveFromQ } = useContext(SaveState);
  const { mui } = useContext(AppTheme);

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
        <Accounts />
        {/* <BillSchedule
          account={ accounts.find(a => a.primary) }
          billData={ bills }
          savedSettings={ settings } />
        { settings && <BigPicture bills={ bills } settings={ settings } /> } */}
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 400px));
  justify-content: center; 
  grid-area: main;
`