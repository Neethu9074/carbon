import React, { Fragment } from 'react';

import { getType } from 'in-websites/analyze/PageLoadView/tabs/Summary/filterableTypes';
import Filter from 'in-websites/analyze/PageLoadView/tabs/Summary/Filter';
import Beacon from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon';
import locals from './Activity.mless';

export default function Activity({ beacons, firstBeacon, pageLoad, filter, setFilter }) {
  return (
    <Fragment>
      <h1 className={locals.header}>Activity</h1>

      <Filter setFilter={setFilter} filter={filter} />

      {beacons.filter(b => filter.types.length === 0 || filter.types.indexOf(getType(b)) !== -1).map(beacon => (
        <Beacon beacon={beacon} pageLoad={pageLoad} earliestTimestamp={firstBeacon.timestamp} key={beacon.beaconId} />
      ))}
    </Fragment>
  );
}
