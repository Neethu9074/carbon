/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { getAppStatusLabel } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers/PerformanceBeacon';
import BatchIndicator from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/BatchIndicator';
import KeyValueHeader from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/KeyValueHeader';
import BodyHeader from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/BodyHeader';
import BackendDi from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/BackendDi';
import Meta from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/Meta';
import { latencyFixed, millisToTwoDecimalSeconds } from 'in-services/formatters/number';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export const getLabel = beacon => beacon.customEventName;

export const getExtraTooltipFields = beacon => ({
  Duration: latencyFixed.compact(beacon.duration)
});

export const LeftHeader = ({ beacon, earliestTimestamp }) => (
  <Fragment>
    <KeyValueHeader
      label={
        <Fragment>
          {t('in-mobile-apps:sessionView.tabsSumCustomEventBeacon.customEventLabel')}
          <BatchIndicator batchCount={beacon.batchSize} />
        </Fragment>
      }
      value={getLabel(beacon)}
    />
    <KeyValueHeader
      label={t('in-mobile-apps:sessionView.tabsSumCustomEventBeacon.startTimeLabel')}
      value={millisToTwoDecimalSeconds(beacon.timestamp - earliestTimestamp)}
      tooltipContent={formatDateTime(beacon.timestamp)}
    />
    <KeyValueHeader
      label={t('in-mobile-apps:sessionView.tabsSumCustomEventBeacon.durationLabel')}
      value={latencyFixed.compact(beacon.duration)}
    />
    {getAppStatusLabel(beacon) && (
      <KeyValueHeader
        label={t('in-mobile-apps:sessionView.tabsSumCustomEventBeacon.appStatusLabel')}
        value={getAppStatusLabel(beacon)}
      />
    )}
  </Fragment>
);

export const Body = ({ beacon }) => {
  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <BodyHeader>{t('in-mobile-apps:sessionView.tabsSumCustomEventBeacon.customEventHeader')}</BodyHeader>

          <Dl>
            <Di title={t('in-mobile-apps:sessionView.tabsSumCustomEventBeacon.eventNameTitle')}>
              {beacon.customEventName}
            </Di>
            <BackendDi beacon={beacon} />
            <Di title={t('in-mobile-apps:sessionView.tabsSumCustomEventBeacon.errMsgTitle')}>{beacon.errorMessage}</Di>
          </Dl>
        </Col>

        {Object.keys(beacon.meta).length > 0 && (
          <Col lg={6}>
            <BodyHeader>{t('in-mobile-apps:sessionView.tabsSumCustomEventBeacon.metaHeader')}</BodyHeader>
            <Meta beacon={beacon} />
          </Col>
        )}
      </Row>
    </Fragment>
  );
};
