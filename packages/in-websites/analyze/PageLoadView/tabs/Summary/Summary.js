/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo, useState } from 'react';
import { find } from 'lodash';

import { Message } from '@instana/components';
import { Link } from '@instana/components';

import { fixClockSkewProblems } from 'in-websites/analyze/PageLoadView/tabs/Summary/fixClockSkewProblems';
import ContentWrapper from 'in-components/LocationAwareTabView/components/ContentWrapper';
import BeaconUserSummary from 'in-websites/analyze/BeaconUserSummary/BeaconUserSummary';
import Activity from 'in-websites/analyze/PageLoadView/tabs/Summary/Activity';
import DateTimeKpiCard from 'in-components/KpiCard/DateTimeKpiCard';
import { useLinkToWebsite } from 'in-websites/navigation/paths';
import { number } from 'in-services/formatters/number';
import { Col, Row } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard';
import { t } from 'in-i18n';

import locals from './Summary.mless';

export default function Summary({ beacons, detailId }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState('');
  const [filterTypes, setFilterTypes] = useState([]);
  // Fixing is expensive. Luckily it is easy to avoid this via memoization.
  const fixResult = useMemo(() => fixClockSkewProblems(beacons), [beacons]);
  beacons = fixResult.beacons;
  beacons = useMemo(() => beacons.slice().sort(beaconsComparator), [beacons]);
  const pageLoad = find(beacons, b => b.type === 'pageLoad');
  const firstBeacon = pageLoad || beacons[0];

  const websiteHref = useLinkToWebsite(firstBeacon.websiteId);

  return (
    <ContentWrapper>
      <Row>
        <Col xs>
          <DateTimeKpiCard
            title={t('in-websites:analyze.analyzeView.pageLoadView.summaryTitleStartTime')}
            time={firstBeacon.timestamp}
          />
        </Col>
        <Col xs>
          <KpiCard
            title={t('in-websites:analyze.analyzeView.pageLoadView.summaryTitleJSErrors')}
            value={getBeaconCount(beacons, 'error')}
            renderValue={number.compact}
          />
        </Col>
        <Col xs>
          <KpiCard
            title={t('in-websites:analyze.analyzeView.pageLoadView.summaryTitleResources')}
            value={getBeaconCount(beacons, 'resourceLoad')}
            renderValue={number.compact}
          />
        </Col>
        <Col xs>
          <KpiCard
            title={t('in-websites:analyze.analyzeView.pageLoadView.summaryTitleHTTPRequests')}
            value={getBeaconCount(beacons, 'httpRequest')}
            renderValue={number.compact}
          />
        </Col>
        <Col xs>
          <KpiCard title={t('in-websites:analyze.analyzeView.pageLoadView.summaryTitleWebsite')}>
            <Link href={websiteHref} className={locals.linkToWebsite}>
              {firstBeacon.websiteLabel}
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
              title={t('in-websites:analyze.analyzeView.pageLoadView.summaryTitleClockSkewProblemsDetected')}
              description={t(
                'in-websites:analyze.analyzeView.pageLoadView.summaryDescriptionClockSkewProblemsDetected'
              )}
            />
          </Col>
        </Row>
      )}

      <BeaconUserSummary beacon={firstBeacon} beacons={beacons} />

      <Activity
        beacons={beacons}
        detailId={detailId}
        pageLoad={pageLoad}
        firstBeacon={firstBeacon}
        query={query}
        setQuery={setQuery}
        page={page}
        setPage={setPage}
        filterTypes={filterTypes}
        setFilterTypes={setFilterTypes}
      />
    </ContentWrapper>
  );
}

function getBeaconCount(beacons, type) {
  return beacons.reduce((agg, beacon) => agg + (beacon.type === type ? beacon.batchSize || 1 : 0), 0);
}

function beaconsComparator(a, b) {
  if (a.type === 'pageLoad') {
    return -1;
  } else if (b.type === 'pageLoad') {
    return 1;
  }

  return a.timestamp - b.timestamp;
}
