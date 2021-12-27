import { IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";
import { HeaderBar, Spacer } from "solid-core/dist/components/styled";
import styled from "styled-components";
import { THEME } from "../App";
import Accounts from "./Accounts";

const Dashboard = ({ user, data }) => {
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
        <Accounts />
      </Content>
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