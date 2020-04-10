import React from 'react';
import styled from 'styled-components';
import { Row } from './theme/ThemeComp'
import { Button } from '@material-ui/core'
import { popupLogin } from '../util/pods';

const Welcome = () => (
  <Container>
    <h2>Your Munny Pouch!</h2>
    <h4>A place to track your munnies.</h4>
    <p>This is a budgeting tool designed to help you understand where your money is allocated and going on a monthly or yearly basis. The idea is to make sure every dollar has a job and that you know what those jobs are to better plan your finances.</p>
    <p><i>We don't use your data!</i> Your personal data is not kept by this application. Instead you own and manage it all yourself using a user "Pod" which you can read more about <a href="https://solid.inrupt.com/how-it-works">here</a>.</p>
    <Row just="flex-end" align="center">
      <Button variant="contained" color="primary" onClick={ popupLogin }>Login</Button>
      <Button color="secondary" href="https://inrupt.net/register">Register</Button>
    </Row>
  </Container>
)

export default Welcome;

const Container = styled.div`
  width: 95vw;
  max-width: 500px;
`