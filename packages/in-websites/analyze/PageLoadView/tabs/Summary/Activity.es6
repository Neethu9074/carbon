import React, { Fragment } from 'react';

import renderers from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/perTypeRenderers';
import { getType } from 'in-websites/analyze/PageLoadView/tabs/Summary/filterableTypes';
import Filter from 'in-websites/analyze/PageLoadView/tabs/Summary/Filter';
import Beacon from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon';
import locals from './Activity.mless';

export default function Activity({ beacons, firstBeacon, pageLoad, filter, setFilter }) {
  return (
    <Fragment>
      <h1 className={locals.header}>Activity</h1>

      <Filter setFilter={setFilter} filter={filter} beacons={beacons} />

      {beacons
        .filter(beacon => {
          if (filter.types.length > 0 && filter.types.indexOf(getType(beacon)) === -1) {
            return false;
          }
          if (filter.page && filter.page.toLowerCase() !== beacon.page.toLowerCase()) {
            return false;
          }
          if (
            filter.query &&
            renderers[beacon.type]
              .getLabel(beacon)
              .toLowerCase()
              .indexOf(filter.query) === -1
          ) {
            return false;
          }
          return true;
        })
        .map(beacon => (
          <Beacon beacon={beacon} pageLoad={pageLoad} earliestTimestamp={firstBeacon.timestamp} key={beacon.beaconId} />
        ))}
    </Fragment>
  );
}
