import React, { Fragment } from 'react';

import Beacon from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon';
import locals from './Activity.mless';

export default function Activity({ beacons, firstBeacon, pageLoad, activeBeaconTypeFilters }) {
  return (
    <Fragment>
      <h1 className={locals.header}>Activity</h1>

      {beacons
        .filter(b => activeBeaconTypeFilters.length === 0 || activeBeaconTypeFilters.indexOf(b.type) !== -1)
        .map(beacon => (
          <Beacon beacon={beacon} pageLoad={pageLoad} earliestTimestamp={firstBeacon.timestamp} key={beacon.beaconId} />
        ))}
    </Fragment>
  );
}
