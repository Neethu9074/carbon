/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { Fragment, FC } from 'react';

// @ts-expect-error Could not find a declaration file for module
import BatchIndicator from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/BatchIndicator';
// @ts-expect-error Could not find a declaration file for module
import KeyValueHeader from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/KeyValueHeader';
// @ts-expect-error Could not find a declaration file for module
import BodyHeader from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/BodyHeader';
import { LeftHeaderProps } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers/types';
import { latencyFixed, millisToTwoDecimalSeconds } from 'in-services/formatters/number';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-components/layout/Grid';
import { isNotBlank } from 'in-services/util/string';
import { MobileAppMonitoringBeacon } from 'in-types';
import { t } from 'in-i18n';

import locals from './PerformanceBeacon.mless';

export const PERFORMANCE_SUBTYPES = {
  AST: 'ast',
  OOM: 'oom',
  ANR: 'anr'
};

export function formatFileSize(fileSize: number) {
  return `${fileSize} mb`;
}

const LABELS = {
  [PERFORMANCE_SUBTYPES.AST]: t('in-mobile-apps:sessionView.tabsSumPerformanceBeacon.appStartTimeLabel'),
  [PERFORMANCE_SUBTYPES.OOM]: t('in-mobile-apps:sessionView.tabsSumPerformanceBeacon.lowMemoryLabel'),
  [PERFORMANCE_SUBTYPES.ANR]: t('in-mobile-apps:sessionView.tabsSumPerformanceBeacon.appNotRespondingLabel')
};

export const getLabel = (beacon: MobileAppMonitoringBeacon) => LABELS[beacon.performanceSubtype] || null;

export const getExtraTooltipFields = () => ({});

export const LeftHeader: FC<LeftHeaderProps> = ({ beacon, earliestTimestamp }) => (
  <Fragment>
    <KeyValueHeader
      label={
        <Fragment>
          {t('in-mobile-apps:sessionView.tabsSumPerformanceBeacon.performanceMetricLabel')}
          <BatchIndicator batchCount={beacon.batchSize} />
        </Fragment>
      }
      value={getLabel(beacon)}
    />
    <KeyValueHeader
      label={t('in-mobile-apps:sessionView.tabsSumPerformanceBeacon.startTimeLabel')}
      value={millisToTwoDecimalSeconds(beacon.timestamp - earliestTimestamp)}
      tooltipContent={formatDateTime(beacon.timestamp)}
    />
    <KeyValueHeader
      label={t('in-mobile-apps:sessionView.tabsSumPerformanceBeacon.durationLabel')}
      value={latencyFixed.compact(beacon.duration)}
    />
  </Fragment>
);

export const Body: FC<{ beacon: MobileAppMonitoringBeacon }> = ({ beacon }) => {
  const {
    performanceSubtype,
    coldStartTimeMs,
    usedMb,
    availableMb,
    maxMb,
    errorMessage,
    hotStartTimeMs,
    warmStartTimeMs
  } = beacon;

  const renderBodyContent = () => {
    switch (performanceSubtype) {
      case PERFORMANCE_SUBTYPES.AST:
        return (
          <>
            {coldStartTimeMs > -1 && (
              <Di
                title={t('in-mobile-apps:sessionView.tabsSumPerformanceBeacon.coldStartTimeLabel')}
                dtClassName={locals.dtClassName}
              >
                {millisToTwoDecimalSeconds(coldStartTimeMs)}
              </Di>
            )}
            {warmStartTimeMs > -1 && (
              <Di
                title={t('in-mobile-apps:sessionView.tabsSumPerformanceBeacon.warmStartTimeLabel')}
                dtClassName={locals.dtClassName}
              >
                {millisToTwoDecimalSeconds(warmStartTimeMs)}
              </Di>
            )}
            {hotStartTimeMs > -1 && (
              <Di
                title={t('in-mobile-apps:sessionView.tabsSumPerformanceBeacon.hotStartTimeLabel')}
                dtClassName={locals.dtClassName}
              >
                {millisToTwoDecimalSeconds(hotStartTimeMs)}
              </Di>
            )}

            {isNotBlank(errorMessage) && (
              <Di
                title={t('in-mobile-apps:sessionView.tabsSumPerformanceBeacon.errMsgTitle')}
                dtClassName={locals.dtClassName}
              >
                {errorMessage}
              </Di>
            )}
          </>
        );
      case PERFORMANCE_SUBTYPES.OOM:
        return (
          <>
            {usedMb > -1 && (
              <Di
                title={t('in-mobile-apps:sessionView.tabsSumPerformanceBeacon.usedMemoryLabel')}
                dtClassName={locals.dtClassName}
              >
                {formatFileSize(usedMb)}
              </Di>
            )}

            {availableMb > -1 && (
              <Di
                title={t('in-mobile-apps:sessionView.tabsSumPerformanceBeacon.availableMemoryLabel')}
                dtClassName={locals.dtClassName}
              >
                {formatFileSize(availableMb)}
              </Di>
            )}

            {maxMb > -1 && (
              <Di
                title={t('in-mobile-apps:sessionView.tabsSumPerformanceBeacon.maximumAvailableMemoryLabel')}
                dtClassName={locals.dtClassName}
              >
                {formatFileSize(maxMb)}
              </Di>
            )}
            {isNotBlank(errorMessage) && (
              <Di
                title={t('in-mobile-apps:sessionView.tabsSumPerformanceBeacon.errMsgTitle')}
                dtClassName={locals.dtClassName}
              >
                {errorMessage}
              </Di>
            )}
          </>
        );
      default:
        return null;
    }
  };

  if (beacon.performanceSubtype == PERFORMANCE_SUBTYPES.ANR) {
    return null;
  }

  return (
    <Fragment>
      <Row>
        <Col lg={8}>
          <BodyHeader>{getLabel(beacon)}</BodyHeader>
          <Dl>{renderBodyContent()}</Dl>
        </Col>
      </Row>
    </Fragment>
  );
};
