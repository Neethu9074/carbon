/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card } from '@instana/components';

import renderers from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers';
import BeaconViewGroup from 'in-mobile-apps/analyze/SessionView/tabs/Summary/BeaconViewGroup';
import OverviewChart from 'in-mobile-apps/analyze/SessionView/tabs/Summary/OverviewChart';
import { getType } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/filterableTypes';
import Filter from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Filter';
import { generateStableHash } from '@instana/utils';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

import locals from './Activity.mless';

export default function Activity({ beacons, firstBeacon, sessionStart, filter, setFilter }) {
  const filteredBeacons = beacons
    .filter(beacon => {
      if (filter.types.length > 0 && filter.types.indexOf(getType(beacon)) === -1) {
        return false;
      }
      if (filter.view && filter.view.toLowerCase() !== beacon.view.toLowerCase()) {
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
    <Row>
      <Col lg={12}>
        <Card title={t('in-mobile-apps:sessionView.tabsSumActivityTitle')}>
          <Filter setFilter={setFilter} filter={filter} beacons={beacons} />
          <div className={locals.overviewChartContainer}>
            <OverviewChart
              beacons={filteredBeacons}
              earliestTimestamp={firstBeacon.timestamp}
              endTimestamp={beacons.reduce((max, beacon) => Math.max(max, beacon.timestamp + beacon.duration), 0)}
            />
          </div>
          {groupBeaconsByView(filteredBeacons).map((group, i) => (
            <BeaconViewGroup
              key={`${i}-${group.view}-${filterHash}`}
              view={group.view}
              beacons={group.beacons}
              sessionStart={sessionStart}
              earliestTimestamp={firstBeacon.timestamp}
            />
          ))}
        </Card>
      </Col>
    </Row>
  );
}

function groupBeaconsByView(beacons) {
  const grouped = [];
  let currentGroup = null;

  beacons.forEach(beacon => {
    if (currentGroup == null || beacon.view !== currentGroup.view) {
      currentGroup = {
        view: beacon.view,
        beacons: [beacon]
      };
      grouped.push(currentGroup);
    } else {
      currentGroup.beacons.push(beacon);
    }
  });

  return grouped;
}
