import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import AccountBreakdown from './AccountBreakdown'
import { getAppData } from '../util/pods';

export default ({ userID }) => {
  let [homepage, setHomepage] = useState();
  let [files, setFiles] = useState();

  async function load(user) {
    const home = "https://" + user.split("/")[2];
    setHomepage(home);
    let loadedFiles = await getAppData(home);
    setFiles(loadedFiles);
  }

  function find(file) {
    if (!files) return
    return files.find(val => val.indexOf(file) >= 0)
  }

  useEffect(() => {
    if (userID) load(userID);
  }, [userID]);

  return (
    <Dash>
      <h3>Budget info from { homepage }</h3>
      { files &&
        <>
          <AccountBreakdown file={ find('accounts') } />
        </>
      }
    </Dash>
  )
}

const Dash = styled.div``
