import React, { Fragment } from 'react';

import locals from './Activity.mless';

export default function Activity({ beacons, activeBeaconTypeFilters }) {
  return (
    <Fragment>
      <h1 className={locals.header}>Activity</h1>

      {beacons
        .filter(b => activeBeaconTypeFilters.length === 0 || activeBeaconTypeFilters.indexOf(b.type) !== -1)
        .map(beacon => (
          <Beacon beacon={beacon} key={beacon.beaconId} />
        ))}
    </Fragment>
  );
}

function Beacon({ beacon }) {
  return <div>{beacon.beaconId}</div>;
}
