/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo, useEffect } from 'react';
import { compose, withState } from 'recompose';
import { find, debounce } from 'lodash';

import { Message } from '@instana/components';
import { Link } from '@instana/components';

import { fixClockSkewProblems } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/fixClockSkewProblems';
import BeaconUserSummary from 'in-mobile-apps/analyze/BeaconUserSummary/BeaconUserSummary';
import ContentWrapper from 'in-components/LocationAwareTabView/components/ContentWrapper';
import Activity from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Activity';
import { getLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import DateTimeKpiCard from 'in-components/KpiCard/DateTimeKpiCard';
import { number } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import { openSession } from 'in-mobile-apps/tracker';
import KpiCard from 'in-components/KpiCard';
import { t } from 'in-i18n';

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

  useEffect(() => {
    debouncedOpenSession({
      sessionId,
      sessionLabel
    });
  }, [sessionId, sessionLabel]);

  return (
    <ContentWrapper>
      <Row>
        <Col xs>
          <DateTimeKpiCard
            title={t('in-mobile-apps:sessionView.tabsSummary.startTimeTitle')}
            time={firstBeacon.timestamp}
          />
        </Col>
        <Col xs>
          <KpiCard
            title={t('in-mobile-apps:sessionView.tabsSummary.httpRequestTitle')}
            value={number.compact(getBeaconCount(beacons, 'httpRequest'))}
          />
        </Col>
        <Col xs>
          <KpiCard
            title={t('in-mobile-apps:sessionView.tabsSummary.mobileAppTitle')}
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
              type="warning"
              title={t('in-mobile-apps:sessionView.tabsSummary.clockProblemTitle')}
              description={t('in-mobile-apps:sessionView.tabsSummary.clockProblemDesc')}
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
