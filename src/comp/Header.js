import React, { useEffect } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom'

import { getField } from '../util/pods';

let HeaderNav = ({ userID, logout }) => {

  const [anchor, setAnchor] = React.useState();
  const [name, setName] = React.useState("Welcome");

  let close = () => setAnchor(null);

  useEffect(() => {
    if (userID) {
      (async function getName() {
        const rec = await getField(userID, "name");
        if (rec) setName(rec.value);
      }())
    }
  }, [userID])

  return (
    <Header>
      <Link to="/">
        <h3>Munny Pouch</h3>
      </Link>

      <span className="spacer" />

      <Button onClick={ event => setAnchor(event.currentTarget) }>
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
        <MenuItem onClick={ () => { logout(); close(); setName("Welcome"); } }>Logout</MenuItem>
      </Menu>
    </Header>
  )
}

export default HeaderNav;

const Header = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 50px;
  width: 100vw;
  display: flex;
  align-items: center;
  color: #fff;
  background: navy;
  box-shadow: gray 1px 1px 5px;

  & * {
    margin: 0px 10px;
    color: #fff;
  }
`
