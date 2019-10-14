import React from 'react';
import styled from 'styled-components';

const Welcome = () => (
  <Container>
    <h2>Your Munny Pouch!</h2>
    <h4>A place to track your munnies.</h4>
    <p>This is a budgeting tool designed to help you understand where your money is allocated and going on a monthly or yearly basis. The idea is to make sure every dollar has a job and that you know what those jobs are to better plan your finances.</p>
    <h4>Login to get started!</h4>
  </Container>
)

export default Welcome;

const Container = styled.div`
  width: 95vw;
  max-width: 500px;
`