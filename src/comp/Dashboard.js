import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import AccountBreakdown from './AccountBreakdown'
import { getAppData, loadFile, saveFile } from '../util/pods';
import { getAccount, deepEquals } from '../util/helper';
import BillSchedule from './BillSchedule';
import YearOverview from './YearOverview';
import BucketView from './BucketView';
import { BottomAnchor } from './theme/ThemeComp';
import { Fab } from '@material-ui/core';

export default ({ userID }) => {
  let [homepage, setHomepage] = useState();
  let [files, setFiles] = useState();
  let [settings, setSettings] = useState(null);
  let [accounts, setAccounts] = useState(null);
  let [bills, setBills] = useState(null);
  let [buckets, setBuckets] = useState(null);
  let [accountBase, setAccountBase] = useState(null);
  let [billBase, setBillBase] = useState(null);
  let [bucketBase, setBucketBase] = useState(null);
  let [isDirty, setDirty] = useState(false);

  async function load(user) {
    const root = "https://" + user.split("/")[2] + "/public";
    setHomepage(root);
    let loadedFiles = await getAppData(root);
    setFiles(loadedFiles);
    let data;

    data = await loadFile(root + '/munny/settings.json', []);
    setSettings(data);

    data = await loadFile(find('accounts') || root + '/munny/accounts.json', []);
    setAccountBase(data);
    setAccounts(data);

    data = await loadFile(find('bills') || root + '/munny/bills.json', []);
    setBillBase(data);
    setBills(data);

    data = await loadFile(find('buckets') || root + '/munny/buckets.json', []);
    setBucketBase(data);
    setBuckets(data);
  }

  function find(file) {
    if (!files) return
    let info = files.find(val => val.name === file);
    return info ? info.url : null;
  }

  async function save() {
    saveFile(find('accounts') || homepage + '/munny/accounts.json', accounts);
    setAccountBase(accounts);
    saveFile(find('buckets') || homepage + '/munny/buckets.json', buckets);
    setBucketBase(buckets);
    saveFile(find('bills') || homepage + '/munny/bills.json', bills);
    setBillBase(bills);
  }

  useEffect(() => {
    if (userID) load(userID);
  }, [userID]);

  useEffect(() => {
    setDirty(
      !deepEquals(accountBase, accounts)
      || !deepEquals(billBase, bills)
      || !deepEquals(bucketBase, buckets));
  }, [accounts, bills, buckets, accountBase, billBase, bucketBase]);

  return (
    <>
      { files &&
        <Widgets>
          <div>
            <AccountBreakdown
              data={ accounts }
              buckets={ buckets }
              save={ setAccounts } />
          </div>

          <div>
            <BucketView
              bucketList={ buckets }
              accountList={ accounts }
              save={ setBuckets } />
          </div>

          <div>
            <BillSchedule
              data={ bills }
              balance={ getAccount(accounts, 'Main').balance }
              settings={ settings }
              save={ setBills } />
          </div>

          <div>
            <YearOverview { ...{ bills, settings } } />
          </div>
        </Widgets>
      }
      {
        isDirty &&
        <BottomAnchor>
          <Fab color="secondary" style={ { color: 'white' } }
            onClick={ save }>
            <i className="material-icons">save</i>
          </Fab>
        </BottomAnchor>
      }
    </>
  )
}

const Widgets = styled.div`
        width: 100vw;
        display: grid;
        justify-content: center;
        grid-template-columns: repeat(auto-fit, minmax(300px, 450px));
        grid-gap: 10px;
      `
