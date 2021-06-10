/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { learnMoreLabel, learnMoreHref, explanation } from 'in-websites/definitions/missingResourceTimings';
import BatchIndicator from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BatchIndicator';
import KeyValueHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/KeyValueHeader';
import { latencyFixed, bytes, millisToTwoDecimalSeconds, millis } from 'in-services/formatters/number';
import BodyHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BodyHeader';
import BackendDi from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BackendDi';
import LearnMore from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/LearnMore';
import Timings from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/Timings';
import Meta from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/Meta';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { explanations } from 'in-websites/cacheInteractionTypes';
import { formatDateTime } from 'in-services/formatters/date';
import { yesOrNo } from 'in-services/formatters/boolean';
import { Row, Col } from 'in-components/layout/Grid';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export const getLabel = beacon => {
  let label = beacon.httpCallMethod;
  if (beacon.locationOrigin === beacon.httpCallOrigin) {
    label = `${label} ${beacon.httpCallUrl.substring(beacon.httpCallOrigin.length)}`;
  } else {
    label = `${label} ${beacon.httpCallUrl}`;
  }

  if (isNotBlank(beacon.graphqlOperationName)) {
    label = `${beacon.graphqlOperationName} (${label})`;

    if (isNotBlank(beacon.graphqlOperationType)) {
      label = `${beacon.graphqlOperationType} ${label}`;
    }
  }

  return label;
};

export const getExtraTooltipFields = beacon => {
  let retrievalTimeTooltipKey = t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconLabelRetrievalTime');
  return {
    [retrievalTimeTooltipKey]: latencyFixed.compact(beacon.duration)
  };
};

export const LeftHeader = ({ beacon, earliestTimestamp }) => (
  <Fragment>
    <KeyValueHeader
      label={
        <Fragment>
          {t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconHeaderRequest')}
          <BatchIndicator batchCount={beacon.batchSize} />
        </Fragment>
      }
      value={getLabel(beacon)}
    />
    <KeyValueHeader
      label={t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconLabelStartTime')}
      value={millisToTwoDecimalSeconds(beacon.timestamp - earliestTimestamp)}
      tooltipContent={formatDateTime(beacon.timestamp)}
    />
    <KeyValueHeader
      label={t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconLabelRetrievalTime')}
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
      label: t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconLabelRedirect'),
      value: beacon.redirectTime
    },
    {
      label: t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconLabelAppCache'),
      value: beacon.appCacheTime
    },
    {
      label: t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconLabelDNS'),
      value: beacon.dnsTime
    },
    {
      label: t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconLabelTCP'),
      value: beacon.tcpTime
    },
    {
      label: t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconLabelSSL'),
      value: beacon.sslTime
    },
    {
      label: t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconLabelRequest'),
      value: beacon.requestTime
    },
    {
      label: t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconLabelResponse'),
      value: beacon.responseTime
    }
  ];
  const hasResourceTimings = resourceTimings.reduce((agg, t) => agg || t.value >= 0, false);
  if (hasResourceTimings) {
    resourceTimings.forEach(t => (t.value = t.value >= 0 ? t.value : 0));
  }

  const hasGraphQl = isNotBlank(beacon.graphqlOperationType) || isNotBlank(beacon.graphqlOperationName);

  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <BodyHeader>
            {t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconHeaderCallDetails')}
          </BodyHeader>
          <Dl>
            <Di title={t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconTitleWindowLocation')}>
              <a href={beacon.locationUrl} rel="noopener noreferrer" target="_blank">
                {beacon.locationUrl}
              </a>
            </Di>
            <Di title={t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconTitleHTTPMethod')}>
              {beacon.httpCallMethod}
            </Di>
            <Di title={t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconTitleHTTPCallURI')}>
              <a href={beacon.httpCallUrl} rel="noopener noreferrer" target="_blank">
                {beacon.httpCallUrl}
              </a>
            </Di>
            {beacon.httpCallStatus > 0 && (
              <Di title={t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconTitleHTTPStatus')}>
                {beacon.httpCallStatus}
              </Di>
            )}
            <BackendDi beacon={beacon} />
            {beacon.backendTime >= 0 && (
              <Di title={t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconTitleTimeToFirstByte')}>
                {millis.fixedCompact(beacon.backendTime)}
              </Di>
            )}
            {isNotBlank(beacon.errorMessage) && (
              <Di title={t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconTitleErrorMessage')}>
                {beacon.errorMessage}
              </Di>
            )}
            <Di title={t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconTitleAsynchronous')}>
              {yesOrNo(beacon.httpCallAsynchronous)}
            </Di>
            <Di title={t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconTitleCorrelationAttempted')}>
              {yesOrNo(beacon.httpCallCorrelationAttempted)}
            </Di>
          </Dl>
        </Col>

        {Object.keys(beacon.meta).length > 0 && (
          <Col lg={6}>
            <BodyHeader>{t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconHeaderMeta')}</BodyHeader>
            <Meta beacon={beacon} />
          </Col>
        )}
      </Row>

      {hasGraphQl && (
        <Row>
          <Col lg={6}>
            <BodyHeader>{t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconHeaderGraphQL')}</BodyHeader>
            <Dl>
              <Di title={t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconTitleOperationName')}>
                {beacon.graphqlOperationName}
              </Di>
              <Di title={t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconTitleOperationType')}>
                {beacon.graphqlOperationType}
              </Di>
            </Dl>
          </Col>
        </Row>
      )}

      {!hasResourceTimings && !hasNetworkInsights && (
        <Row>
          <Col lg={6}>
            <BodyHeader>
              {t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconHeaderResourceTiming')}
            </BodyHeader>
            <LearnMore explanation={explanation} href={learnMoreHref} buttonLabel={learnMoreLabel} />
          </Col>
        </Row>
      )}

      <Row>
        {hasResourceTimings && (
          <Col lg={6}>
            <BodyHeader>
              {t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconHeaderResourceTiming')}
            </BodyHeader>
            <Timings
              timings={resourceTimings}
              totalDuration={beacon.duration}
              totalDurationName={t(
                'in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconTotalDurationNameRetrievalTime'
              )}
            />
          </Col>
        )}

        {hasNetworkInsights && (
          <Col lg={6}>
            <BodyHeader>
              {t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconHeaderNetworkInsights')}
            </BodyHeader>
            <Dl>
              <Di title="Cache Interaction">{explanations[beacon.cacheInteraction]}</Di>
              {hasTransferSize && (
                <Di title={t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconTitleTransferSize')}>
                  {bytes.detailed(beacon.transferSize)}
                </Di>
              )}
              {hasEncodedBodySize && (
                <Di title={t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconTitleEncodedBodySize')}>
                  {bytes.detailed(beacon.encodedBodySize)}
                </Di>
              )}
              {hasDencodedBodySize && (
                <Di title={t('in-websites:analyze.analyzeView.pageLoadView.httpRequestBeaconTitleDecodedBodySize')}>
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
