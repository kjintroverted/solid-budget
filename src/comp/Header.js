import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

let HeaderNav = ({ logout }) => {

  const [anchor, setAnchor] = React.useState();

  let close = () => setAnchor(null);

  return (
    <Header>
      <h3>Munny Pouch</h3>
      <span className="spacer" />
      <Button onClick={ event => setAnchor(event.currentTarget) }>
        <Icon className="material-icons click">person</Icon>
      </Button>
      <Menu
        anchorEl={ anchor }
        keepMounted
        open={ Boolean(anchor) }
        onClose={ close }
      >
        <MenuItem onClick={ close }>Profile</MenuItem>
        <MenuItem onClick={ () => { logout(); close(); } }>Logout</MenuItem>
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
  }
`

const Icon = styled.i`
  color: #fff;
`