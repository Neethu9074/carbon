import { compose, withState } from 'recompose';
import { find, debounce } from 'lodash';
import React, { useMemo } from 'react';

import { fixClockSkewProblems } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/fixClockSkewProblems';
import ContentWrapper from 'in-new-components/LocationAwareTabView/components/ContentWrapper';
import BeaconUserSummary from 'in-mobile-apps/analyze/BeaconUserSummary/BeaconUserSummary';
import Activity from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Activity';
import DateTimeKpiCard from 'in-new-components/KpiCard/DateTimeKpiCard';
import { getLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import LifecycleObserver from 'in-components/LifecycleObserver';
import { warning } from 'in-new-components/Message/types';
import { Row, Col } from 'in-new-components/layout/Grid';
import { number } from 'in-services/formatters/number';
import { openSession } from 'in-mobile-apps/tracker';
import Message from 'in-new-components/Message';
import KpiCard from 'in-new-components/KpiCard';
import Link from 'in-components/Link';

import locals from './Summary.mless';

// avoid potential high-refrequency updates when the user is just flicking through
// views very quickly.
const debouncedOpenSession = debounce(openSession, 1000);

export default compose(withState('filter', 'setFilter', { query: '', view: '', types: [] }))(Summary);

function Summary({ beacons, filter, setFilter, sessionLabel, sessionId }) {
  // Fixing is expensive. Luckily it is easy to avoid this via memoization.
  const fixResult = useMemo(() => fixClockSkewProblems(beacons), [beacons]);
  beacons = fixResult.beacons;
  const sessionStart = find(beacons, b => b.type === 'sessionStart');
  const firstBeacon = sessionStart || beacons[0];

  return (
    <ContentWrapper>
      <LifecycleObserver
        onDidMount={() => {
          debouncedOpenSession({
            sessionId,
            sessionLabel
          });
        }}
      />

      <Row>
        <Col xs>
          <DateTimeKpiCard title="Start Time" time={firstBeacon.timestamp} />
        </Col>
        <Col xs>
          <KpiCard title="HTTP Requests" value={number.compact(getBeaconCount(beacons, 'httpRequest'))} />
        </Col>
        <Col xs>
          <KpiCard
            title="Mobile App"
            raw
            value={
              <Link href$={getLinkToMobileApp(firstBeacon.mobileAppId)} className={locals.linkToMobileApp}>
                {firstBeacon.mobileAppLabel}
              </Link>
            }
          />
        </Col>
      </Row>

      {fixResult.requiredFixes && (
        <Row>
          <Col lg={12}>
            <Message
              type={warning}
              title="Clock Skew Problems Detected"
              description="Beacons sent to Instana from the end-user's device arrived with significant delays, most likely due to a
              poor client network. To prevent inconsistencies, the timestamps shown in this view were adapted to restore
              a meaningful activity timeline."
            />
          </Col>
        </Row>
      )}

      <BeaconUserSummary beacon={firstBeacon} beacons={beacons} />

      <Activity
        beacons={beacons}
        sessionStart={sessionStart}
        firstBeacon={firstBeacon}
        filter={filter}
        setFilter={setFilter}
      />
    </ContentWrapper>
  );
}

function getBeaconCount(beacons, type) {
  return beacons.reduce((agg, beacon) => agg + (beacon.type === type ? beacon.batchSize || 1 : 0), 0);
}
