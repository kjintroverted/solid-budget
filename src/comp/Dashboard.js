import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { withWebId } from '@inrupt/solid-react-components';

import AccountBreakdown from './AccountBreakdown'
import BillSchedule from './BillSchedule';
import YearOverview from './YearOverview';
import BucketView from './BucketView';
import { BottomAnchor } from './theme/ThemeComp';
import { Fab } from '@material-ui/core';
import { getAppStoragePath, fetchDocument, createNonExistentDocument, unmarshal } from '../util/pods';
import accountShape from '../contexts/account-shape.json';

const Dashboard = ({ webId }) => {

  const [accountFolder, setAccountFolder] = useState("");

  async function init() {
    const storage = await getAppStoragePath(webId);
    setAccountFolder(`${ storage }accounts/`);
  }

  async function load(folder, shape) {
    console.log("loading:", folder);
    const folderDoc = await fetchDocument(folder);
    const data = [];
    for await (const item of folderDoc['ldp:contains']) {
      data.push(await unmarshal(item.value, shape))
    }
    console.log("accounts", data);

  }

  async function save(shape, data) {
    data.forEach(async datum => {
      datum.uri = `${ accountFolder }${ datum.name.toLowerCase() }_${ datum.label.toLowerCase() }.ttl`;
      let doc = await fetchDocument(datum.uri);
      if (!doc) {
        await createNonExistentDocument(datum.uri);
        doc = await fetchDocument(datum.uri);
      }
      shape.shape.forEach(async ({ prefix, predicate, alias }) => {
        const object = datum[alias || predicate];
        await doc[`${ shape['@context'][prefix] }${ predicate }`].add(object + '');
      })
    })
  }

  useEffect(() => {
    if (webId) init(webId);
  }, [webId]);

  useEffect(() => {
    if (accountFolder) load(accountFolder, accountShape);
  }, [accountFolder]);

  return (
    <>
      <Widgets>
        { false &&
          <div>
            <AccountBreakdown />
          </div>
        }

        { false &&
          <div>
            <BucketView />
          </div>
        }

        { false &&
          <div>
            <BillSchedule />
          </div>
        }

        { false &&
          <div>
            <YearOverview />
          </div>
        }
      </Widgets>
      {
        false &&
        <BottomAnchor>
          <Fab color="secondary" style={ { color: 'white' } } >
            <i className="material-icons">save</i>
          </Fab>
        </BottomAnchor>
      }
    </>
  )
}

export default withWebId(Dashboard);

const Widgets = styled.div`
        width: 100vw;
        display: grid;
        justify-content: center;
        grid-template-columns: repeat(auto-fit, minmax(300px, 450px));
        grid-gap: 10px;
      `
