import React, { useEffect } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom'

import { getField } from '../util/pods';
import { AppBar, Toolbar } from '@material-ui/core';
const logo = require("../assets/munny_pouch.png");

let HeaderNav = ({ userID, logout, login }) => {

  const [anchor, setAnchor] = React.useState();
  const [name, setName] = React.useState("Login");

  let close = () => setAnchor(null);

  async function getName() {
    const rec = await getField(userID, "name");
    if (rec) setName(rec.value);
  }

  useEffect(() => {
    if (userID) getName();
  }, [userID])

  return (
    <AppBar>
      <Toolbar>
        <Link to="/">
          <Logo src={ logo } alt="logo" />
        </Link>
        <Link to="/">
          <h3>Munny Pouch</h3>
        </Link>

        <span className="spacer" />

        <Button style={ { color: "white" } } onClick={ event => userID ? setAnchor(event.currentTarget) : login() }>
          { name }
          <i className="material-icons click">person</i>
        </Button>

        <Menu
          anchorEl={ anchor }
          keepMounted
          open={ Boolean(anchor) }
          onClose={ close }
        >
          <Link to="/settings">
            <MenuItem onClick={ close }>Settings</MenuItem>
          </Link>
          <Link to="/">
            <MenuItem onClick={ () => { logout(); close(); setName("Login"); } }>Logout</MenuItem>
          </Link>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default HeaderNav;

const Logo = styled.img`
  height: 40px;
  margin: 0px 10px;
`
