import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { withWebId } from "@inrupt/solid-react-components";

import AccountBreakdown from "./AccountBreakdown";
import BillSchedule from "./BillSchedule";
import YearOverview from "./YearOverview";
import BucketView from "./BucketView";
import { BottomAnchor } from "./theme/ThemeComp";
import { Fab } from "@material-ui/core";
import {
  getAppStoragePath,
  fetchDocument,
  createNonExistentDocument,
  unmarshal,
  deleteFile
} from "../util/pods";
import accountShape from "../contexts/account-shape";
import bucketShape from "../contexts/bucket-shape";
import { deepEquals } from "../util/helper";

const Dashboard = ({ webId }) => {
  const [isDirty, setDirty] = useState(false);
  const [markedDocs, markDocs] = useState([]);

  // ACCOUNT TRACKING
  const [accountFolder, setAccountFolder] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [savedAccounts, setSavedAccounts] = useState([]);

  // BUCKET TRACKING
  const [bucketFolder, setBucketFolder] = useState("");
  const [buckets, setBuckets] = useState([]);
  const [savedBuckets, setSavedBuckets] = useState([]);

  async function init() {
    const storage = await getAppStoragePath(webId);
    setAccountFolder(`${storage}accounts/`);
    setBucketFolder(`${storage}buckets/`);
  }

  async function load(folder, shape, ...hooks) {
    const folderDoc = await fetchDocument(folder);
    if (!folderDoc) return;
    const data = [];
    for await (const item of folderDoc["ldp:contains"]) {
      data.push(await unmarshal(item.value, shape));
    }
    hooks.forEach(f => f(data));
  }

  async function saveAll() {
    await Promise.all([
      save(accountShape, accounts, accountFolder),
      save(bucketShape, buckets, bucketFolder),
      Promise.all(markedDocs.map(deleteFile))
    ]);
    setSavedAccounts(accounts);
    setSavedBuckets(buckets);
    console.log("Successfully saved");
  }

  async function save(shape, data, folder) {
    return Promise.all(
      data.map(async datum => {
        datum.uri = `${folder}${datum.name.toLowerCase()}_${datum.label.toLowerCase()}.ttl`;
        let doc = await fetchDocument(datum.uri);
        if (!doc) {
          await createNonExistentDocument(datum.uri);
          doc = await fetchDocument(datum.uri);
        }
        shape.shape.forEach(async ({ prefix, predicate, alias, stringify }) => {
          const object = datum[alias || predicate];
          await doc[`${shape["@context"][prefix]}${predicate}`].set(
            stringify ? stringify(object) : object
          );
        });
      })
    );
  }

  function markForDelete(object) {
    markDocs([...markedDocs, object.uri]);
  }

  // LOAD NEW USER
  useEffect(() => {
    if (webId) init(webId);
  }, [webId]);

  // LOAD DATA WHEN FOLDER UPDATES
  useEffect(() => {
    if (accountFolder)
      load(accountFolder, accountShape, setAccounts, setSavedAccounts);
  }, [accountFolder]);
  useEffect(() => {
    if (bucketFolder)
      load(bucketFolder, bucketShape, setBuckets, setSavedBuckets);
  }, [bucketFolder]);

  // CHECK FOR DIRTY FORMS ON DATA UPDATE
  useEffect(() => {
    setDirty(
      !deepEquals(savedAccounts, accounts) || !deepEquals(savedBuckets, buckets)
    );
  }, [accounts, savedAccounts, buckets, savedBuckets]);

  return (
    <>
      <Widgets>
        <div>
          <AccountBreakdown
            data={accounts}
            update={setAccounts}
            onDelete={markForDelete}
          />
        </div>

        <div>
          <BucketView
            bucketList={buckets}
            accountList={accounts}
            onUpdate={setBuckets}
            onDelete={markForDelete}
          />
        </div>

        {false && (
          <div>
            <BillSchedule />
          </div>
        )}

        {false && (
          <div>
            <YearOverview />
          </div>
        )}
      </Widgets>
      {isDirty && (
        <BottomAnchor>
          <Fab color='secondary' style={{ color: "white" }} onClick={saveAll}>
            <i className='material-icons'>save</i>
          </Fab>
        </BottomAnchor>
      )}
    </>
  );
};

export default withWebId(Dashboard);

const Widgets = styled.div`
  width: 100vw;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, minmax(300px, 450px));
  grid-gap: 10px;
`;
