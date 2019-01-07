import { compose, withState } from 'recompose';
import { find } from 'lodash';
import React from 'react';

import ContentWrapper from 'in-new-components/LocationAwareTabView/components/ContentWrapper';
import BeaconUserSummary from 'in-websites/analyze/BeaconUserSummary/BeaconUserSummary';
import Activity from 'in-websites/analyze/PageLoadView/tabs/Summary/Activity';
import DateTimeKpiCard from 'in-new-components/KpiCard/DateTimeKpiCard';
import { millis, number } from 'in-services/formatters/number';
import { Row, Col } from 'in-new-components/layout/Grid';
import KpiCard from 'in-new-components/KpiCard';

export default compose(withState('filter', 'setFilter', { query: '', page: '', types: [] }))(Summary);

function Summary({ beacons, filter, setFilter }) {
  const pageLoad = find(beacons, b => b.type === 'pageLoad');
  const firstBeacon = pageLoad || beacons[0];

  return (
    <ContentWrapper>
      <Row>
        <Col lg={2}>
          <DateTimeKpiCard title="Start Time" time={firstBeacon.timestamp} />
        </Col>
        {pageLoad && (
          <Col lg={2}>
            <KpiCard title="onLoad Time" value={millis.fixedCompact(pageLoad.duration)} />
          </Col>
        )}
        <Col lg={2}>
          <KpiCard title="JavaScript Errors" value={number.compact(getBeaconCount(beacons, 'error'))} />
        </Col>
        <Col lg={2}>
          <KpiCard title="Resources" value={number.compact(getBeaconCount(beacons, 'resourceLoad'))} />
        </Col>
        <Col lg={2}>
          <KpiCard title="HTTP Requests" value={number.compact(getBeaconCount(beacons, 'httpRequest'))} />
        </Col>
      </Row>

      <BeaconUserSummary beacon={firstBeacon} />

      <Activity beacons={beacons} pageLoad={pageLoad} firstBeacon={firstBeacon} filter={filter} setFilter={setFilter} />
    </ContentWrapper>
  );
}

function getBeaconCount(beacons, type) {
  return beacons.reduce((agg, beacon) => agg + (beacon.type === type ? beacon.batchSize || 1 : 0), 0);
}
