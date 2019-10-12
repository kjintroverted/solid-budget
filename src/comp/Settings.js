import React, { useState } from 'react';
import styled from 'styled-components';
import { withWebId, ShexFormBuilder } from '@inrupt/solid-react-components';
import { Tabs, Tab } from '@material-ui/core';
import TabPanel from './TabPanel';

const Settings = ({ webId }) => {

  const [value, setValue] = useState(0);

  return (
    <Container>
      <Tabs value={ value } onChange={ (event, newVal) => setValue(newVal) } aria-label="simple tabs example">
        <Tab label="Account" />
        <Tab label="Settings" />
      </Tabs>
      <TabPanel value={ value } index={ 0 }>
        <ShexContainer>
          <ShexFormBuilder
            { ...{
              documentUri: webId,
              shexUri: 'https://shexshapes.inrupt.net/public/userprofile.shex',
              theme: {
                form: 'shexForm',
                shexPanel: 'shexPanel',
                shexRoot: 'shexRoot',
                deleteButton: 'deleteButton ids-button-stroke ids-button-stroke--secondary',
                inputContainer: 'inputContainer',
                addButtonStyle: 'addButton ids-button-stroke ids-button-stroke--secondary'
              },
              successCallback: console.info,
              errorCallback: console.error,
              autoSaveMode: true
            } }
          />
        </ShexContainer>
      </TabPanel>
      <TabPanel value={ value } index={ 1 }>
        Item Two
      </TabPanel>
    </Container >
  )
}

export default withWebId(Settings);

const ShexContainer = styled.div`
  width: 95vw;
  max-width: 500px;
`

const Container = styled.div`
  width: 95vw;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
`