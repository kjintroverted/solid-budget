import React from 'react';
import './App.css';
import styled from 'styled-components';

function App() {
  return (
    <div className="App">
      <Header>
        <h3>Munny</h3>
      </Header>
    </div>
  );
}

export default App;

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