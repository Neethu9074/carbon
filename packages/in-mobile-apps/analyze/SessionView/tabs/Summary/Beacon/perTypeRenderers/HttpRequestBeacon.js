/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import BatchIndicator from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/BatchIndicator';
import KeyValueHeader from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/KeyValueHeader';
import BodyHeader from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/BodyHeader';
import BackendDi from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/BackendDi';
import { latencyFixed, bytes, millisToTwoDecimalSeconds } from 'in-services/formatters/number';
import Meta from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/Meta';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
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
  return label;
};

export const getExtraTooltipFields = beacon => {
  let retrievalTimeTooltipKey = t('in-mobile-apps:sessionView.tabsSumHttpRequestBeacon.retrievalTimeTooltip');
  return {
    [retrievalTimeTooltipKey]: latencyFixed.compact(beacon.duration)
  };
};

export const LeftHeader = ({ beacon, earliestTimestamp }) => (
  <Fragment>
    <KeyValueHeader
      label={
        <Fragment>
          {t('in-mobile-apps:sessionView.tabsSumHttpRequestBeacon.requestLabel')}
          <BatchIndicator batchCount={beacon.batchSize} />
        </Fragment>
      }
      value={getLabel(beacon)}
    />
    <KeyValueHeader
      label={t('in-mobile-apps:sessionView.tabsSumHttpRequestBeacon.startTimeLabel')}
      value={millisToTwoDecimalSeconds(beacon.timestamp - earliestTimestamp)}
      tooltipContent={formatDateTime(beacon.timestamp)}
    />
    <KeyValueHeader
      label={t('in-mobile-apps:sessionView.tabsSumHttpRequestBeacon.retrievalTimeLabel')}
      value={latencyFixed.compact(beacon.duration)}
    />
  </Fragment>
);

export const Body = ({ beacon }) => {
  const hasTransferSize = beacon.transferSize >= 0;
  const hasEncodedBodySize = beacon.encodedBodySize >= 0;
  const hasDencodedBodySize = beacon.decodedBodySize >= 0;

  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <BodyHeader>{t('in-mobile-apps:sessionView.tabsSumHttpRequestBeacon.callDetailsHeader')}</BodyHeader>
          <Dl>
            <Di title={t('in-mobile-apps:sessionView.tabsSumHttpRequestBeacon.httpCallURITitle')}>
              <a href={beacon.httpCallUrl} rel="noopener noreferrer" target="_blank">
                {beacon.httpCallUrl}
              </a>
            </Di>
            <BackendDi beacon={beacon} />
            <Di title={t('in-mobile-apps:sessionView.tabsSumHttpRequestBeacon.httpMethodTitle')}>
              {beacon.httpCallMethod}
            </Di>
            <Di title={t('in-mobile-apps:sessionView.tabsSumHttpRequestBeacon.httpStatusTitle')}>
              {beacon.httpCallStatus}
            </Di>
            {isNotBlank(beacon.errorMessage) && (
              <Di title={t('in-mobile-apps:sessionView.tabsSumHttpRequestBeacon.errMsgTitle')}>
                {beacon.errorMessage}
              </Di>
            )}
          </Dl>
        </Col>

        {Object.keys(beacon.meta).length > 0 && (
          <Col lg={6}>
            <BodyHeader>{t('in-mobile-apps:sessionView.tabsSumHttpRequestBeacon.metaHeader')}</BodyHeader>
            <Meta beacon={beacon} />
          </Col>
        )}
      </Row>

      {hasTransferSize ||
        hasEncodedBodySize ||
        (hasDencodedBodySize && (
          <Row>
            <Col lg={6}>
              <BodyHeader>{t('in-mobile-apps:sessionView.tabsSumHttpRequestBeacon.networkInsightsHeader')}</BodyHeader>
              <Dl>
                {hasTransferSize && (
                  <Di title={t('in-mobile-apps:sessionView.tabsSumHttpRequestBeacon.transferSizeTitle')}>
                    {bytes.detailed(beacon.transferSize)}
                  </Di>
                )}
                {hasEncodedBodySize && (
                  <Di title={t('in-mobile-apps:sessionView.tabsSumHttpRequestBeacon.encodedBodySizeTitle')}>
                    {bytes.detailed(beacon.encodedBodySize)}
                  </Di>
                )}
                {hasDencodedBodySize && (
                  <Di title={t('in-mobile-apps:sessionView.tabsSumHttpRequestBeacon.decodedBodySizeTitle')}>
                    {bytes.detailed(beacon.decodedBodySize)}
                  </Di>
                )}
              </Dl>
            </Col>
          </Row>
        ))}
    </Fragment>
  );
};
