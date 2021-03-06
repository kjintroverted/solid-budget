import React, { useEffect } from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Link } from "react-router-dom";
import { withWebId } from "@inrupt/solid-react-components";

import { AppBar, Toolbar } from "@material-ui/core";
import data from "@solid/query-ldflex";
import { popupLogin, logout } from '../util/pods'
import { clearCache } from "../util/cache";

const logo = require("../assets/munny_pouch.png");

let HeaderNav = ({ webId, loggedIn, onUpdate }) => {
  const [anchor, setAnchor] = React.useState();
  const [name, setName] = React.useState(null);

  useEffect(() => {
    async function getName() {
      const user = data[webId];
      const name = await user.vcard_fn;
      setName(name.value);
    }

    if (webId) getName();
  }, [webId]);

  function close() {
    setAnchor(null);
  }

  function onLogout() {
    clearCache();
    setName(null);
    onUpdate(false);
    logout();
    close();
  }

  return (
    <AppBar>
      <Toolbar>
        <Link to='/'>
          <Logo src={ logo } alt='logo' />
        </Link>
        <Link to='/'>
          <h3 style={ { color: 'white' } }>Munny Pouch</h3>
        </Link>

        <span className='spacer' />

        <Button
          style={ { color: "white" } }
          onClick={ loggedIn ? event => setAnchor(event.currentTarget) : popupLogin }
        >
          { loggedIn ? name : "Login" }
          <i className='material-icons click'>person</i>
        </Button>

        <Menu
          anchorEl={ anchor }
          keepMounted
          open={ Boolean(anchor) }
          onClose={ close }
        >
          <Link to='/settings'>
            <MenuItem onClick={ close }>Account</MenuItem>
          </Link>
          <Link to='/'>
            <MenuItem onClick={ onLogout }>Logout</MenuItem>
          </Link>
        </Menu>
      </Toolbar>
    </AppBar >
  );
};

export default withWebId(HeaderNav);

const Logo = styled.img`
  height: 40px;
  margin: 0px 10px;
`;
