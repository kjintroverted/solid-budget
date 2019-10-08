import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { withWebId } from '@inrupt/solid-react-components';

import AccountBreakdown from './AccountBreakdown'
import BillSchedule from './BillSchedule';
import YearOverview from './YearOverview';
import BucketView from './BucketView';
import { BottomAnchor } from './theme/ThemeComp';
import { Fab } from '@material-ui/core';
import { getAppStoragePath, getDataPath, fetchDocument } from '../util/pods';

const Dashboard = ({ webId }) => {

  async function load() {
    const storage = await getAppStoragePath(webId);
    const dataPath = await getDataPath(storage);
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
