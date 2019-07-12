import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import AccountBreakdown from './AccountBreakdown'
import { getAppData, loadFile, saveFile } from '../util/pods';

export default ({ userID }) => {
  let [homepage, setHomepage] = useState();
  let [files, setFiles] = useState();
  let [accounts, setAccounts] = useState(null);

  async function load(user) {
    const root = "https://" + user.split("/")[2] + "/public";
    setHomepage(root);
    let loadedFiles = await getAppData(root);
    setFiles(loadedFiles);
    let data;

    data = await loadFile(find('accounts') || root + '/munny/accounts.json', []);
    setAccounts(data);
  }

  function find(file) {
    if (!files) return
    let info = files.find(val => val.name === file);
    return info ? info.url : null;
  }

  useEffect(() => {
    if (userID) load(userID);
  }, [userID]);

  return (
    <>
      { files &&
        <Widgets>
          <AccountBreakdown
            data={ accounts }
            save={ data => {
              saveFile(find('accounts') || homepage + '/munny/accounts.json', data);
              setAccounts(data);
            } } />
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
