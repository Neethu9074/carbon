/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import KeyValueHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/KeyValueHeader';
import { learnMoreLabel, learnMoreHref, explanation } from 'in-websites/definitions/missingResourceTimings';
import { latencyFixed, bytes, millisToTwoDecimalSeconds, millis } from 'in-services/formatters/number';
import BodyHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BodyHeader';
import BackendDi from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BackendDi';
import LearnMore from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/LearnMore';
import Timings from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/Timings';
import Meta from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/Meta';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { explanations } from 'in-websites/cacheInteractionTypes';
import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import { t } from 'in-i18n';

export const getLabel = beacon => {
  let label = beacon.httpCallUrl;
  if (beacon.locationOrigin === beacon.httpCallOrigin) {
    label = beacon.httpCallUrl.substring(beacon.httpCallOrigin.length);
  }
  return label;
};

export const getExtraTooltipFields = beacon => {
  let retrievalTimeTooltipKey = t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconLabelRetrievalTime');
  return {
    [retrievalTimeTooltipKey]: latencyFixed.compact(beacon.duration)
  };
};

export const LeftHeader = ({ beacon, earliestTimestamp }) => (
  <Fragment>
    <KeyValueHeader
      label={t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconLabelPageResource')}
      value={getLabel(beacon)}
    />
    <KeyValueHeader
      label={t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconLabelStartTime')}
      value={millisToTwoDecimalSeconds(beacon.timestamp - earliestTimestamp)}
      tooltipContent={formatDateTime(beacon.timestamp)}
    />
    <KeyValueHeader
      label={t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconLabelRetrievalTime')}
      value={latencyFixed.compact(beacon.duration)}
    />
  </Fragment>
);

export const Body = ({ beacon }) => {
  const hasTransferSize = beacon.transferSize >= 0;
  const hasEncodedBodySize = beacon.encodedBodySize >= 0;
  const hasDencodedBodySize = beacon.decodedBodySize >= 0;
  const hasCacheInteraction = !!explanations[beacon.cacheInteraction];
  const hasNetworkInsights = hasTransferSize || hasEncodedBodySize || hasDencodedBodySize || hasCacheInteraction;

  const resourceTimings = [
    {
      label: t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconLabelRedirect'),
      value: beacon.redirectTime
    },
    {
      label: t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconLabelAppCache'),
      value: beacon.appCacheTime
    },
    {
      label: t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconLabelDNS'),
      value: beacon.dnsTime
    },
    {
      label: t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconLabelTCP'),
      value: beacon.tcpTime
    },
    {
      label: t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconLabelSSL'),
      value: beacon.sslTime
    },
    {
      label: t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconLabelRequest'),
      value: beacon.requestTime
    },
    {
      label: t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconLabelResponse'),
      value: beacon.responseTime
    }
  ];
  const hasResourceTimings = resourceTimings.reduce((agg, t) => agg || t.value >= 0, false);
  if (hasResourceTimings) {
    resourceTimings.forEach(t => (t.value = t.value >= 0 ? t.value : 0));
  }

  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <BodyHeader>{t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconHeaderAsset')}</BodyHeader>
          <Dl>
            <Di title={t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconTitleWindowLocation')}>
              <a href={beacon.locationUrl} rel="noopener noreferrer" target="_blank">
                {beacon.locationUrl}
              </a>
            </Di>
            <Di title={t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconTitleResourceURI')}>
              <a href={beacon.httpCallUrl} rel="noopener noreferrer" target="_blank">
                {beacon.httpCallUrl}
              </a>
            </Di>
            {beacon.backendTime >= 0 && (
              <Di title={t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconTitleTimeToFirstByte')}>
                {millis.fixedCompact(beacon.backendTime)}
              </Di>
            )}
            <BackendDi beacon={beacon} />
            <Di title={t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconTitleCacheInteraction')}>
              {beacon.initiator}
            </Di>
          </Dl>
        </Col>

        {Object.keys(beacon.meta).length > 0 && (
          <Col lg={6}>
            <BodyHeader>{t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconHeaderMeta')}</BodyHeader>
            <Meta beacon={beacon} />
          </Col>
        )}
      </Row>

      {!hasResourceTimings && !hasNetworkInsights && (
        <Row>
          <Col lg={6}>
            <BodyHeader>
              {t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconHeaderResourceTiming')}
            </BodyHeader>
            <LearnMore explanation={explanation} href={learnMoreHref} buttonLabel={learnMoreLabel} />
          </Col>
        </Row>
      )}

      <Row>
        {hasResourceTimings && (
          <Col lg={6}>
            <BodyHeader>
              {t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconHeaderResourceTiming')}
            </BodyHeader>
            <Timings
              timings={resourceTimings}
              totalDuration={beacon.duration}
              totalDurationName={t(
                'in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconTotalDurationNameRetrievalTime'
              )}
            />
          </Col>
        )}

        {hasNetworkInsights && (
          <Col lg={6}>
            <BodyHeader>
              {t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconHeaderNetworkInsights')}
            </BodyHeader>
            <Dl>
              <Di title={t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconTitleCacheInteraction')}>
                {explanations[beacon.cacheInteraction]}
              </Di>
              {hasTransferSize && (
                <Di title={t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconTitleTransferSize')}>
                  {bytes.detailed(beacon.transferSize)}
                </Di>
              )}
              {hasEncodedBodySize && (
                <Di title={t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconTitleEncodedBodySize')}>
                  {bytes.detailed(beacon.encodedBodySize)}
                </Di>
              )}
              {hasDencodedBodySize && (
                <Di title={t('in-websites:analyze.analyzeView.pageLoadView.resourceLoadBeaconTitleDecodedBodySize')}>
                  {bytes.detailed(beacon.decodedBodySize)}
                </Di>
              )}
            </Dl>
          </Col>
        )}
      </Row>
    </Fragment>
  );
};
