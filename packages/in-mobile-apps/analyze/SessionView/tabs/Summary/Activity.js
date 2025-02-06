/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { generateStableHash } from '@instana/utils';
import { Card } from '@instana/components';

import renderers from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers';
import BeaconViewGroup from 'in-mobile-apps/analyze/SessionView/tabs/Summary/BeaconViewGroup';
import OverviewChart from 'in-mobile-apps/analyze/SessionView/tabs/Summary/OverviewChart';
import { getType } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/filterableTypes';
import Filter from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Filter';
import { Col, Row } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

import locals from './Activity.mless';

export default function Activity({
  beacons,
  detailId,
  firstBeacon,
  sessionStart,
  view,
  setView,
  query,
  setQuery,
  types,
  setTypes
}) {
  const filteredBeacons = beacons
    .filter(beacon => {
      return !(
        (types?.length > 0 && types?.indexOf(getType(beacon)) === -1) ||
        (view && view?.toLowerCase() !== beacon?.view?.toLowerCase()) ||
        !renderers[beacon?.type] ||
        (query && renderers[beacon?.type]?.getLabel(beacon).toLowerCase().indexOf(query) === -1)
      );
    })
    .sort((a, b) => a.timestamp - b.timestamp);

  // we want to force all expansion states to reset when filtering
  const filterHash = generateStableHash({ view, query, types });

  return (
    <Row>
      <Col lg={12}>
        <Card title={t('in-mobile-apps:sessionView.tabsSumActivityTitle')}>
          <Filter
            setQuery={setQuery}
            view={view}
            setView={setView}
            filterTypes={types}
            setTypes={setTypes}
            beacons={beacons}
          />
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
              detailId={detailId}
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

Activity.propTypes = {
  beacons: PropTypes.array.isRequired,
  detailId: PropTypes.string,
  firstBeacon: PropTypes.object,
  sessionStart: PropTypes.number,
  setView: PropTypes.func,
  query: PropTypes.string,
  setQuery: PropTypes.func,
  types: PropTypes.array,
  setTypes: PropTypes.func,
  view: PropTypes.string
};
