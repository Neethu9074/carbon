/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import { t } from 'in-i18n';

import KeyValueHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/KeyValueHeader';
import BodyHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BodyHeader';
import BackendDi from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BackendDi';
import Timings from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/Timings';
import { millis, latencyFixed, fourDecimalPlaces } from 'in-services/formatters/number';
import Meta from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/Meta';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { Row, Col } from 'in-new-components/layout/Grid';

export const getLabel = beacon => beacon.locationUrl;

export const hideStartTimeTooltipField = true;

export const getExtraTooltipFields = beacon => ({
  'onLoad Time': latencyFixed.compact(beacon.duration)
});

export const LeftHeader = ({ beacon }) => (
  <Fragment>
    <KeyValueHeader
      label={t('in-websites:analyze.analyzeView.pageLoadView.pageLoadBeaconLabelPageLoad')}
      value={getLabel(beacon)}
    />
    <KeyValueHeader
      label={t('in-websites:analyze.analyzeView.pageLoadView.pageLoadBeaconLabelOnLoadTime')}
      value={latencyFixed.compact(beacon.duration)}
    />
  </Fragment>
);

export const Body = ({ beacon }) => {
  const navigationTimings = [
    {
      label: t('in-websites:analyze.analyzeView.pageLoadView.pageLoadBeaconLabelUnload'),
      value: beacon.unloadTime
    },
    {
      label: t('in-websites:analyze.analyzeView.pageLoadView.pageLoadBeaconLabelRedirect'),
      value: beacon.redirectTime
    },
    {
      label: t('in-websites:analyze.analyzeView.pageLoadView.pageLoadBeaconLabelAppCache'),
      value: beacon.appCacheTime
    },
    {
      label: t('in-websites:analyze.analyzeView.pageLoadView.pageLoadBeaconLabelDNS'),
      value: beacon.dnsTime
    },
    {
      label: t('in-websites:analyze.analyzeView.pageLoadView.pageLoadBeaconLabelTCP'),
      value: beacon.tcpTime
    },
    {
      label: t('in-websites:analyze.analyzeView.pageLoadView.pageLoadBeaconLabelSSL'),
      value: beacon.sslTime
    },
    {
      label: t('in-websites:analyze.analyzeView.pageLoadView.pageLoadBeaconLabelRequest'),
      value: beacon.requestTime
    },
    {
      label: t('in-websites:analyze.analyzeView.pageLoadView.pageLoadBeaconLabelResponse'),
      value: beacon.responseTime
    },
    {
      label: t('in-websites:analyze.analyzeView.pageLoadView.pageLoadBeaconLabelDOM'),
      value: beacon.domTime
    },
    {
      label: t('in-websites:analyze.analyzeView.pageLoadView.pageLoadBeaconLabelChildren'),
      value: beacon.childrenTime
    }
  ];
  const hasNavigationTimings = navigationTimings.reduce((agg, t) => agg || t.value >= 0, false);
  if (hasNavigationTimings) {
    navigationTimings.forEach(t => (t.value = t.value >= 0 ? t.value : 0));
  }

  const webVitals = [
    beacon.firstContentfulPaintTime > -1 && (
      <Di key={0} title={t('in-websites:analyze.analyzeView.pageLoadView.pageLoadBeaconTitleFirstContentfulPaint')}>
        {millis.fixedCompact(beacon.firstContentfulPaintTime)}
      </Di>
    ),
    beacon.largestContentfulPaintTime > -1 && (
      <Di key={1} title={t('in-websites:analyze.analyzeView.pageLoadView.pageLoadBeaconTitleLargestContentfulPaint')}>
        {millis.fixedCompact(beacon.largestContentfulPaintTime)}
      </Di>
    ),
    beacon.firstInputDelayTime > -1 && (
      <Di key={2} title={t('in-websites:analyze.analyzeView.pageLoadView.pageLoadBeaconTitleFirstInputDelay')}>
        {millis.fixedCompact(beacon.firstInputDelayTime)}
      </Di>
    ),
    beacon.cumulativeLayoutShift >= 0 && (
      <Di key={3} title={t('in-websites:analyze.analyzeView.pageLoadView.pageLoadBeaconTitleCumulativeLayoutShift')}>
        {fourDecimalPlaces(beacon.cumulativeLayoutShift)}
      </Di>
    ),
    beacon.backendTime >= 0 && (
      <Di key={4} title={t('in-websites:analyze.analyzeView.pageLoadView.pageLoadBeaconTitleTimeToFirstByte')}>
        {millis.fixedCompact(beacon.backendTime)}
      </Di>
    )
  ].filter(Boolean);

  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <BodyHeader>{t('pageLoadBeaconHeaderDocument')}</BodyHeader>
          <Dl>
            <Di title={t('in-websites:analyze.analyzeView.pageLoadView.pageLoadBeaconTitleWindowLocation')}>
              <a href={beacon.locationUrl} rel="noopener noreferrer" target="_blank">
                {beacon.locationUrl}
              </a>
            </Di>
            <BackendDi beacon={beacon} />
            {beacon.firstPaintTime > -1 && (
              <Di title={t('in-websites:analyze.analyzeView.pageLoadView.pageLoadBeaconTitleFirstPaint')}>
                {millis.fixedCompact(beacon.firstPaintTime)}
              </Di>
            )}
          </Dl>
        </Col>

        {Object.keys(beacon.meta).length > 0 && (
          <Col lg={6}>
            <BodyHeader>{t('pageLoadBeaconHeaderMeta')}</BodyHeader>
            <Meta beacon={beacon} />
          </Col>
        )}
      </Row>

      {webVitals.length > 0 ||
        (hasNavigationTimings && (
          <Row>
            {hasNavigationTimings && (
              <Col lg={6}>
                <BodyHeader>{t('pageLoadBeaconHeaderNavigationTiming')}</BodyHeader>
                <Timings
                  timings={navigationTimings}
                  totalDuration={beacon.duration}
                  totalDurationName={t(
                    'in-websites:analyze.analyzeView.pageLoadView.pageLoadBeaconTotalDurationNameRetrievalTime'
                  )}
                />
              </Col>
            )}

            {webVitals.length > 0 && (
              <Col lg={6}>
                <BodyHeader>{t('pageLoadBeaconHeaderWebVitals')}</BodyHeader>
                {webVitals}
              </Col>
            )}
          </Row>
        ))}
    </Fragment>
  );
};
