/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Fragment } from 'react';

import { getAppStatusLabel } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers/PerformanceBeacon';
import BeaconStack from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/StackTrace/BeaconStack';
import BatchIndicator from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/BatchIndicator';
import KeyValueHeader from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/KeyValueHeader';
import BodyHeader from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/BodyHeader';
import Meta from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/Meta';
import { latencyFixed, millisToTwoDecimalSeconds } from 'in-services/formatters/number';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-components/layout/Grid';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export const getLabel = beacon => beacon.errorMessage;

export const getExtraTooltipFields = beacon => ({
  Duration: latencyFixed.compact(beacon.duration)
});

export const LeftHeader = ({ beacon, earliestTimestamp }) => (
  <Fragment>
    <KeyValueHeader
      label={
        <Fragment>
          {t('in-mobile-apps:sessionView.tabsSumCrashBeacon.crashLabel')}
          <BatchIndicator batchCount={beacon.batchSize} />
        </Fragment>
      }
      value={getLabel(beacon)}
    />
    <KeyValueHeader
      label={t('in-mobile-apps:sessionView.tabsSumCrashBeacon.startTimeLabel')}
      value={millisToTwoDecimalSeconds(beacon.timestamp - earliestTimestamp)}
      tooltipContent={formatDateTime(beacon.timestamp)}
    />
    {getAppStatusLabel(beacon) && (
      <KeyValueHeader
        label={t('in-mobile-apps:sessionView.tabsSumCrashBeacon.appStatusLabel')}
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
          <BodyHeader>{t('in-mobile-apps:sessionView.tabsSumCrashBeacon.crashHeader')}</BodyHeader>
          <Dl>
            <Di title={t('in-mobile-apps:sessionView.tabsSumCrashBeacon.errorMsg')}>{beacon.errorMessage}</Di>
            <Di title={t('in-mobile-apps:sessionView.tabsSumCrashBeacon.errorType')}>{beacon.errorType}</Di>
          </Dl>
        </Col>

        {Object.keys(beacon.meta).length > 0 && (
          <Col lg={6}>
            <BodyHeader>{t('in-mobile-apps:sessionView.tabsSumCrashBeacon.metaHeader')}</BodyHeader>
            <Meta beacon={beacon} />
          </Col>
        )}
      </Row>
      <Row>
        {isNotBlank(beacon.stackTrace) && (
          <Col lg={12}>
            <BeaconStack beacon={beacon} />
          </Col>
        )}
      </Row>
    </Fragment>
  );
};
