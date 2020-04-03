import React, { useEffect, useState } from "react";
import styled from "styled-components";

import AccountBreakdown from "./AccountBreakdown";
import BillSchedule from "./BillSchedule";
import YearOverview from "./YearOverview";
import BucketView from "./BucketView";
import Welcome from "../components/Welcome";
import { BottomAnchor, FabLoader } from "../components/theme/ThemeComp";
import { Fab, CircularProgress } from "@material-ui/core";
import {
  save,
  load,
  deleteFile
} from "../util/pods";
import { deepEquals, getMainBalance } from "../util/helper";
import accountShape from "../contexts/account-shape";
import bucketShape from "../contexts/bucket-shape";
import billShape from "../contexts/bill-shape";
import Warning from "../components/Warning";

const Dashboard = ({ settings, auth, storage }) => {
  const [isDirty, setDirty] = useState(false);
  const [markedDocs, markDocs] = useState([]);
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null)

  // ACCOUNT TRACKING
  const [accountFolder, setAccountFolder] = useState("");
  const [accounts, setAccounts] = useState(null);
  const [savedAccounts, setSavedAccounts] = useState([]);

  // BUCKET TRACKING
  const [bucketFolder, setBucketFolder] = useState("");
  const [buckets, setBuckets] = useState(null);
  const [savedBuckets, setSavedBuckets] = useState([]);

  // BILL TRACKING
  const [billFolder, setBillFolder] = useState("");
  const [bills, setBills] = useState(null);
  const [savedBills, setSavedBills] = useState([]);

  async function saveAll() {
    setSaving(true);
    await Promise.all([
      save(accountShape, accounts, accountFolder),
      save(bucketShape, buckets, bucketFolder),
      save(billShape, bills, billFolder),
      Promise.all(markedDocs.map(deleteFile))
    ]);
    setSavedAccounts(accounts);
    setSavedBuckets(buckets);
    setSavedBills(bills);
    setSaving(false);
  }

  function markForDelete(object) {
    markDocs([...markedDocs, object.uri]);
  }

  function getLastUpdated(accounts) {
    const lastUpd = accounts.reduce((min, x) => !min || x.lastUpdated < min ? x.lastUpdated : min, new Date());
    setLastUpdated(lastUpd)
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
      load(accountFolder, accountShape, setAccounts, setSavedAccounts, getLastUpdated)
        .then(success => {
          if (!success) setAccounts([]);
        })
  }, [accountFolder]);

  useEffect(() => {
    if (bucketFolder)
      load(bucketFolder, bucketShape, setBuckets, setSavedBuckets)
        .then(success => {
          if (!success) setBuckets([]);
        })
  }, [bucketFolder]);

  useEffect(() => {
    if (billFolder)
      load(billFolder, billShape, setBills, setSavedBills)
        .then(success => {
          if (!success) setBills([]);
        })
  }, [billFolder]);

  // CHECK FOR DIRTY FORMS ON DATA UPDATE
  useEffect(() => {
    if (!accounts || !bills || !buckets) return;
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
      {
        lastUpdated && <Warning lastUpdated={ lastUpdated } />
      }
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
          <BillSchedule
            data={ bills }
            balance={ getMainBalance(accounts) }
            settings={ settings }
            onUpdate={ setBills }
            onDelete={ markForDelete } />
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
          <YearOverview bills={ bills } settings={ settings } />
        </div>

      </Widgets>

      { isDirty && (
        <BottomAnchor>
          <Fab
            color='secondary'
            style={ { color: "white" } }
            onClick={ saveAll }
            disabled={ saving }
          >
            <i className='material-icons'>save</i>
          </Fab>
          { saving && <FabLoader><CircularProgress size={ 68 } /></FabLoader> }
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
