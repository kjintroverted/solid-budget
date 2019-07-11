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
    let info = files.find(val => val.name == file);
    return info ? info.url : null;
  }

  useEffect(() => {
    if (userID) load(userID);
  }, [userID]);

  return (
    <>
      <h3>Budget info from { homepage }</h3>
      { files &&
        <Widgets>
          <AccountBreakdown file={ find('accounts') || homepage + '/munny/accounts.json' } />
        </Widgets>
      }
    </>
  )
}

const Widgets = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fill, minmax(300px, 540px));
`
