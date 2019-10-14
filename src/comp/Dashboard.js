import React, { useEffect, useState } from "react";
import styled from "styled-components";

import AccountBreakdown from "./AccountBreakdown";
import BillSchedule from "./BillSchedule";
import YearOverview from "./YearOverview";
import BucketView from "./BucketView";
import Welcome from "./Welcome";
import { BottomAnchor } from "./theme/ThemeComp";
import { Fab } from "@material-ui/core";
import {
  save,
  load,
  deleteFile
} from "../util/pods";
import { deepEquals, getMainBalance } from "../util/helper";
import accountShape from "../contexts/account-shape";
import bucketShape from "../contexts/bucket-shape";
import billShape from "../contexts/bill-shape";

const Dashboard = ({ settings, auth, storage }) => {
  const [isDirty, setDirty] = useState(false);
  const [markedDocs, markDocs] = useState([]);

  // ACCOUNT TRACKING
  const [accountFolder, setAccountFolder] = useState("");
  const [accounts, setAccounts] = useState(null);
  const [savedAccounts, setSavedAccounts] = useState([]);

  // BUCKET TRACKING
  const [bucketFolder, setBucketFolder] = useState("");
  const [buckets, setBuckets] = useState([]);
  const [savedBuckets, setSavedBuckets] = useState([]);

  // BILL TRACKING
  const [billFolder, setBillFolder] = useState("");
  const [bills, setBills] = useState([]);
  const [savedBills, setSavedBills] = useState([]);

  async function saveAll() {
    await Promise.all([
      save(accountShape, accounts, accountFolder),
      save(bucketShape, buckets, bucketFolder),
      save(billShape, bills, billFolder),
      Promise.all(markedDocs.map(deleteFile))
    ]);
    setSavedAccounts(accounts);
    setSavedBuckets(buckets);
    setSavedBills(bills);
    console.log("Successfully saved");
  }

  function markForDelete(object) {
    markDocs([...markedDocs, object.uri]);
  }

  // LOAD NEW USER
  useEffect(() => {
    async function init() {
      setAccountFolder(`${ storage }accounts/`);
      setBucketFolder(`${ storage }buckets/`);
      setBillFolder(`${ storage }bills/`);
    }

    if (storage) init();
  }, [storage]);

  // LOAD DATA WHEN FOLDER UPDATES
  useEffect(() => {
    if (accountFolder)
      load(accountFolder, accountShape, setAccounts, setSavedAccounts)
        .then(success => {
          if (!success) setAccounts([]);
        })
  }, [accountFolder]);

  useEffect(() => {
    if (bucketFolder)
      load(bucketFolder, bucketShape, setBuckets, setSavedBuckets);
  }, [bucketFolder]);

  useEffect(() => {
    if (billFolder)
      load(billFolder, billShape, setBills, setSavedBills);
  }, [billFolder]);

  // CHECK FOR DIRTY FORMS ON DATA UPDATE
  useEffect(() => {
    setDirty(
      !deepEquals(savedAccounts, accounts)
      || !deepEquals(savedBuckets, buckets)
      || !deepEquals(savedBills, bills)
    );
  }, [
    accounts, savedAccounts,
    buckets, savedBuckets,
    bills, savedBills
  ]);

  // RENDER()
  if (!auth) return <Welcome />

  return (
    <>
      <Widgets>
        <div>
          <AccountBreakdown
            data={ accounts }
            buckets={ buckets }
            onUpdate={ setAccounts }
            onDelete={ markForDelete }
          />
        </div>

        <div>
          <BucketView
            bucketList={ buckets }
            accountList={ accounts }
            onUpdate={ setBuckets }
            onDelete={ markForDelete }
          />
        </div>

        <div>
          <BillSchedule
            data={ bills }
            balance={ getMainBalance(accounts) }
            settings={ settings }
            onUpdate={ setBills }
            onDelete={ markForDelete } />
        </div>

        <div>
          <YearOverview bills={ bills } settings={ settings } />
        </div>

      </Widgets>

      { isDirty && (
        <BottomAnchor>
          <Fab color='secondary' style={ { color: "white" } } onClick={ saveAll }>
            <i className='material-icons'>save</i>
          </Fab>
        </BottomAnchor>
      ) }
    </>
  );
};

export default Dashboard;

const Widgets = styled.div`
  width: 100vw;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, minmax(300px, 450px));
  grid-gap: 10px;
`;
