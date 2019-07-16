import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import AccountBreakdown from './AccountBreakdown'
import { getAppData, loadFile, saveFile } from '../util/pods';
import { getAccount } from '../util/helper';
import BillSchedule from './BillSchedule';
import YearOverview from './YearOverview';

export default ({ userID }) => {
  let [homepage, setHomepage] = useState();
  let [files, setFiles] = useState();
  let [accounts, setAccounts] = useState(null);
  let [bills, setBills] = useState(null);
  let [settings, setSettings] = useState(null);

  async function load(user) {
    const root = "https://" + user.split("/")[2] + "/public";
    setHomepage(root);
    let loadedFiles = await getAppData(root);
    setFiles(loadedFiles);
    let data;

    data = await loadFile(root + '/munny/settings.json', []);
    setSettings(data);

    data = await loadFile(find('accounts') || root + '/munny/accounts.json', []);
    setAccounts(data);

    data = await loadFile(find('bills') || root + '/munny/bills.json', []);
    setBills(data);
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
          <div>
            <AccountBreakdown
              data={ accounts }
              save={ data => {
                saveFile(find('accounts') || homepage + '/munny/accounts.json', data);
                setAccounts(data);
              } } />
          </div>

          <div>
            <BillSchedule
              data={ bills }
              balance={ getAccount(accounts, 'Main').balance }
              settings={ settings }
              save={ data => {
                saveFile(find('bills') || homepage + '/munny/bills.json', data);
                setBills(data);
              } } />
          </div>

          <div>
            <YearOverview { ...{ bills, settings } } />
          </div>
        </Widgets>
      }
    </>
  )
}

const Widgets = styled.div`
        width: 100vw;
        display: grid;
        justify-content: center;
        grid-template-columns: repeat(auto-fit, minmax(300px, 540px));
        grid-gap: 10px;
      `
