import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { withWebId } from '@inrupt/solid-react-components';

import AccountBreakdown from './AccountBreakdown'
import BillSchedule from './BillSchedule';
import YearOverview from './YearOverview';
import BucketView from './BucketView';
import { BottomAnchor } from './theme/ThemeComp';
import { Fab } from '@material-ui/core';
import { getAppStoragePath, initializeStorage, fetchDocument, createNonExistentDocument } from '../util/pods';
import accountShape from '../contexts/account-shape.json';

const Dashboard = ({ webId }) => {

  const [accountFolder, setAccountFolder] = useState("");

  async function load() {
    const storage = await getAppStoragePath(webId);
    setAccountFolder(`${ storage }accounts/`);
  }

  async function save(shape, data) {
    data.forEach(async datum => {
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
    if (webId) load(webId);
  }, [webId]);

  return (
    <>
      { false &&
        <Widgets>
          <div>
            <AccountBreakdown />
          </div>

          <div>
            <BucketView />
          </div>

          <div>
            <BillSchedule />
          </div>

          <div>
            <YearOverview />
          </div>
        </Widgets>
      }
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
