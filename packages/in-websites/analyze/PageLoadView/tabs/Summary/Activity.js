/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { generateStableHash } from '@instana/utils';
import { Card } from '@instana/components';

import renderers from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/perTypeRenderers';
import BeaconPageGroup from 'in-websites/analyze/PageLoadView/tabs/Summary/BeaconPageGroup';
import OverviewChart from 'in-websites/analyze/PageLoadView/tabs/Summary/OverviewChart';
import { getType } from 'in-websites/analyze/PageLoadView/tabs/Summary/filterableTypes';
import Filter from 'in-websites/analyze/PageLoadView/tabs/Summary/Filter';
import { Col, Row } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

import locals from './Activity.mless';

export default function Activity({
  detailId,
  beacons,
  firstBeacon,
  pageLoad,
  query,
  setQuery,
  page,
  setPage,
  filterTypes,
  setFilterTypes
}) {
  const filteredBeacons = beacons
    .filter(beacon => {
      if (filterTypes.length > 0 && filterTypes.indexOf(getType(beacon)) === -1) {
        return false;
      }
      if (page && page.toLowerCase() !== beacon.page.toLowerCase()) {
        return false;
      }
      if (
        query &&
        renderers[beacon.type]
          .getLabel(beacon)
          .toLowerCase()
          .indexOf(query) === -1
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => a.timestamp - b.timestamp);

  // we want to force all expansion states to reset when filtering
  const filterHash = generateStableHash({ page, query, filterTypes });

  return (
    <Row>
      <Col lg={12}>
        <Card title={t('in-websites:analyze.analyzeView.pageLoadView.activityTitle')}>
          <Filter
            query={query}
            setQuery={setQuery}
            page={page}
            setPage={setPage}
            filterTypes={filterTypes}
            setFilterTypes={setFilterTypes}
            beacons={beacons}
          />
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
              detailId={detailId}
            />
          ))}
        </Card>
      </Col>
    </Row>
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
