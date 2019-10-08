import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import { withWebId } from '@inrupt/solid-react-components';

import './App.css';
import HeaderNav from './comp/Header';
import Settings from './comp/Settings';
import Dashboard from './comp/Dashboard';
import { theme } from './comp/theme/Provider';
import AddPayment from './comp/api/AddPayment';
import Login from './comp/Login';

function App({ webId }) {

  return (
    <Router>
      <ThemeProvider theme={ theme }>
        <div className="App">
          <HeaderNav />
          <Content>
            { !webId ?
              <Route path="/" exact render={ () => <Login /> } /> :
              <Route path="/" exact render={ () => <Dashboard /> } /> }
            <Route path="/settings/" render={ () => <Settings /> } />
            <Route path="/api/payment/" component={ AddPayment } />
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
`