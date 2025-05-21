/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo, useState } from 'react';
import { find } from 'lodash';

import { Message } from '@instana/components';
import { Link } from '@instana/components';

import { fixClockSkewProblems } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/fixClockSkewProblems';
import BeaconUserSummary from 'in-mobile-apps/analyze/BeaconUserSummary/BeaconUserSummary';
import ContentWrapper from 'in-components/LocationAwareTabView/components/ContentWrapper';
import Activity from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Activity';
import { useGetLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import DateTimeKpiCard from 'in-components/KpiCard/DateTimeKpiCard';
import { number } from 'in-services/formatters/number';
import { Col, Row } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard';
import { t } from 'in-i18n';

import locals from './Summary.mless';

export default function Summary({ beacons, detailId }) {
  // Fixing is expensive. Luckily it is easy to avoid this via memoization.
  const fixResult = useMemo(() => fixClockSkewProblems(beacons), [beacons]);
  beacons = fixResult.beacons;
  const sessionStart = find(beacons, b => b.type === 'sessionStart');
  const firstBeacon = sessionStart || beacons[0];
  const [query, setQuery] = useState('');
  const [view, setView] = useState('');
  const [types, setTypes] = useState([]);
  const [appState, setAppState] = useState('');

  const linkToMobileAppHref = useGetLinkToMobileApp(firstBeacon.mobileAppId);
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
          <KpiCard title={t('in-mobile-apps:sessionView.tabsSummary.mobileAppTitle')}>
            <Link href={linkToMobileAppHref} className={locals.linkToMobileApp}>
              {firstBeacon.mobileAppLabel}
            </Link>
          </KpiCard>
        </Col>
      </Row>

      {fixResult.requiredFixes && (
        <Row>
          <Col lg={12}>
            <Message
              className={locals.message}
              inline
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
        detailId={detailId}
        sessionStart={sessionStart}
        firstBeacon={firstBeacon}
        query={query}
        setQuery={setQuery}
        view={view}
        setView={setView}
        types={types}
        setTypes={setTypes}
        appState={appState}
        setAppState={setAppState}
      />
    </ContentWrapper>
  );
}

function getBeaconCount(beacons, type) {
  return beacons.reduce((agg, beacon) => agg + (beacon.type === type ? beacon.batchSize || 1 : 0), 0);
}
