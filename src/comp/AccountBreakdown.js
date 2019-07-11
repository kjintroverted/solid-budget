import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { loadJSON, writeJSON } from '../util/pods';

export default ({ file }) => {
  let [accounts, updateAccounts] = useState([]);

  async function loadAccounts() {
    let loadedAccounts = await loadJSON(file, []);
    updateAccounts(loadedAccounts);
    console.log('accounts', loadedAccounts);
  }

  useEffect(() => {
    loadAccounts();
    return () => writeJSON(file, accounts);
  }, [file])
  return (
    <AccountList>

    </AccountList>
  )
}

const AccountList = styled.section`

`