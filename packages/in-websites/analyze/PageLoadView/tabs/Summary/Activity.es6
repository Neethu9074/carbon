import React, { Fragment } from 'react';

import renderers from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/perTypeRenderers';
import BeaconPageGroup from 'in-websites/analyze/PageLoadView/tabs/Summary/BeaconPageGroup';
import OverviewChart from 'in-websites/analyze/PageLoadView/tabs/Summary/OverviewChart';
import { getType } from 'in-websites/analyze/PageLoadView/tabs/Summary/filterableTypes';
import Filter from 'in-websites/analyze/PageLoadView/tabs/Summary/Filter';
import { generateStableHash } from 'in-services/util/id';

import locals from './Activity.mless';

export default function Activity({ beacons, firstBeacon, pageLoad, filter, setFilter }) {
  const filteredBeacons = beacons
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
    .sort((a, b) => a.timestamp - b.timestamp);

  // we want to force all expansion states to reset when filtering
  const filterHash = generateStableHash(filter);

  return (
    <Fragment>
      <h1 className={locals.header}>Activity</h1>

      <Filter setFilter={setFilter} filter={filter} beacons={beacons} />
      <div className={locals.overviewChartContainer}>
        <OverviewChart
          beacons={filteredBeacons}
          earliestTimestamp={firstBeacon.timestamp}
          endTimestamp={beacons.reduce((max, beacon) => Math.max(max, beacon.timestamp + beacon.duration), 0)}
        />
      </div>
      {groupBeaconsByPage(filteredBeacons).map((group, i) => (
        <BeaconPageGroup
          key={`${i}-${group.page}-${filterHash}`}
          page={group.page}
          beacons={group.beacons}
          pageLoad={pageLoad}
          earliestTimestamp={firstBeacon.timestamp}
        />
      ))}
    </Fragment>
  );
}

function groupBeaconsByPage(beacons) {
  const grouped = [];
  let currentGroup = null;

  beacons.forEach(beacon => {
    if (currentGroup == null || beacon.page !== currentGroup.page) {
      currentGroup = {
        page: beacon.page,
        beacons: [beacon]
      };
      grouped.push(currentGroup);
    } else {
      currentGroup.beacons.push(beacon);
    }
  });

  return grouped;
}
