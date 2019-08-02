import { compose, withState } from 'recompose';
import { find, debounce } from 'lodash';
import memoizeOne from 'memoize-one';
import React from 'react';

import { fixClockSkewProblems } from 'in-websites/analyze/PageLoadView/tabs/Summary/fixClockSkewProblems';
import ContentWrapper from 'in-new-components/LocationAwareTabView/components/ContentWrapper';
import BeaconUserSummary from 'in-websites/analyze/BeaconUserSummary/BeaconUserSummary';
import Activity from 'in-websites/analyze/PageLoadView/tabs/Summary/Activity';
import DateTimeKpiCard from 'in-new-components/KpiCard/DateTimeKpiCard';
import { latencyFixed, number } from 'in-services/formatters/number';
import ProblemIndicator from 'in-new-components/ProblemIndicator';
import LifecycleObserver from 'in-components/LifecycleObserver';
import { Row, Col } from 'in-new-components/layout/Grid';
import { openPageLoad } from 'in-websites/tracker';
import KpiCard from 'in-new-components/KpiCard';

// avoid potential high-refrequency updates when the user is just flicking through
// views very quickly.
const debouncedOpenPageLoad = debounce(openPageLoad, 1000);

// Fixing is expensive. Luckily it is easy to avoid this via memoization.
const memoizedFixClockSkewProblems = memoizeOne(fixClockSkewProblems);

export default compose(withState('filter', 'setFilter', { query: '', page: '', types: [] }))(Summary);

function Summary({ beacons, filter, setFilter, pageLoadLabel, pageLoadId }) {
  const fixResult = memoizedFixClockSkewProblems(beacons);
  beacons = fixResult.beacons;
  const pageLoad = find(beacons, b => b.type === 'pageLoad');
  const firstBeacon = pageLoad || beacons[0];

  return (
    <ContentWrapper>
      <LifecycleObserver
        onDidMount={() => {
          debouncedOpenPageLoad({
            pageLoadId,
            pageLoadLabel
          });
        }}
      />

      <Row>
        <Col lg={2}>
          <DateTimeKpiCard title="Start Time" time={firstBeacon.timestamp} />
        </Col>
        {pageLoad && (
          <Col lg={2}>
            <KpiCard title="onLoad Time" value={latencyFixed.compact(pageLoad.duration)} />
          </Col>
        )}
        <Col lg={2}>
          <KpiCard title="JS Errors" value={number.compact(getBeaconCount(beacons, 'error'))} />
        </Col>
        <Col lg={2}>
          <KpiCard title="Resources" value={number.compact(getBeaconCount(beacons, 'resourceLoad'))} />
        </Col>
        <Col lg={2}>
          <KpiCard title="HTTP Requests" value={number.compact(getBeaconCount(beacons, 'httpRequest'))} />
        </Col>
      </Row>

      {fixResult.requiredFixes && (
        <Row>
          <Col lg={12}>
            <ProblemIndicator kind="warning" title="Clock Skew Problems Detected">
              Beacons sent to Instana from the end-user’s device arrived with significant delays, most likely due to a
              poor client network. To prevent inconsistencies, the timestamps shown in this view were adapted to restore
              a meaningful activity timeline.
            </ProblemIndicator>
          </Col>
        </Row>
      )}

      <BeaconUserSummary beacon={firstBeacon} beacons={beacons} />

      <Activity beacons={beacons} pageLoad={pageLoad} firstBeacon={firstBeacon} filter={filter} setFilter={setFilter} />
    </ContentWrapper>
  );
}

function getBeaconCount(beacons, type) {
  return beacons.reduce((agg, beacon) => agg + (beacon.type === type ? beacon.batchSize || 1 : 0), 0);
}
