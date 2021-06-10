/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo, useEffect } from 'react';
import { compose, withState } from 'recompose';
import { find, debounce } from 'lodash';

import { Link } from '@instana/components';

import { fixClockSkewProblems } from 'in-websites/analyze/PageLoadView/tabs/Summary/fixClockSkewProblems';
import ContentWrapper from 'in-new-components/LocationAwareTabView/components/ContentWrapper';
import BeaconUserSummary from 'in-websites/analyze/BeaconUserSummary/BeaconUserSummary';
import Activity from 'in-websites/analyze/PageLoadView/tabs/Summary/Activity';
import DateTimeKpiCard from 'in-new-components/KpiCard/DateTimeKpiCard';
import { getLinkToWebsite } from 'in-websites/navigation/paths';
import { warning } from 'in-new-components/Message/types';
import { number } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import { openPageLoad } from 'in-websites/tracker';
import Message from 'in-new-components/Message';
import KpiCard from 'in-new-components/KpiCard';
import { t } from 'in-i18n';

import locals from './Summary.mless';

// avoid potential high-refrequency updates when the user is just flicking through
// views very quickly.
const debouncedOpenPageLoad = debounce(openPageLoad, 1000);

export default compose(withState('filter', 'setFilter', { query: '', page: '', types: [] }))(Summary);

function Summary({ beacons, filter, setFilter, pageLoadLabel, pageLoadId }) {
  // Fixing is expensive. Luckily it is easy to avoid this via memoization.
  const fixResult = useMemo(() => fixClockSkewProblems(beacons), [beacons]);
  beacons = fixResult.beacons;
  beacons = useMemo(() => beacons.slice().sort(beaconsComparator), [beacons]);
  const pageLoad = find(beacons, b => b.type === 'pageLoad');
  const firstBeacon = pageLoad || beacons[0];

  useEffect(() => {
    debouncedOpenPageLoad({
      pageLoadId,
      pageLoadLabel
    });
  }, [pageLoadId, pageLoadLabel]);

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
            value={number.compact(getBeaconCount(beacons, 'error'))}
          />
        </Col>
        <Col xs>
          <KpiCard
            title={t('in-websites:analyze.analyzeView.pageLoadView.summaryTitleResources')}
            value={number.compact(getBeaconCount(beacons, 'resourceLoad'))}
          />
        </Col>
        <Col xs>
          <KpiCard
            title={t('in-websites:analyze.analyzeView.pageLoadView.summaryTitleHTTPRequests')}
            value={number.compact(getBeaconCount(beacons, 'httpRequest'))}
          />
        </Col>
        <Col xs>
          <KpiCard
            title={t('in-websites:analyze.analyzeView.pageLoadView.summaryTitleWebsite')}
            raw
            value={
              <Link href$={getLinkToWebsite(firstBeacon.websiteId)} className={locals.linkToWebsite}>
                {firstBeacon.websiteLabel}
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
              title={t('in-websites:analyze.analyzeView.pageLoadView.summaryTitleClockSkewProblemsDetected')}
              description={t(
                'in-websites:analyze.analyzeView.pageLoadView.summaryDescriptionClockSkewProblemsDetected'
              )}
            />
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

function beaconsComparator(a, b) {
  if (a.type === 'pageLoad') {
    return -1;
  } else if (b.type === 'pageLoad') {
    return 1;
  }

  return a.timestamp - b.timestamp;
}
