import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import { withWebId } from "@inrupt/solid-react-components";

import "./App.css";
import HeaderNav from "./comp/Header";
import Dashboard from "./comp/Dashboard";
import { theme } from "./comp/theme/Provider";

function App({ webId }) {

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => setLoggedIn(!!webId), [webId])

  return (
    <Router>
      <ThemeProvider theme={ theme }>
        <div className='App'>
          <HeaderNav onUpdate={ setLoggedIn } />
          <Content>
            <Route path='/' exact render={ () => <Dashboard auth={ loggedIn } settings={ { "paycheck": 2600, "payDate": "2019-07-05" } } /> } />
          </Content>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default withWebId(App);

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
  margin-bottom: 20px;
  padding: 0px 5px;
`;
