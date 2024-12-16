/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { useObservable } from '@instana/hooks';

import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import AlertsPreviewLanePresenter from 'in-alerting/components/Chart/AlertsPreviewLane/AlertsPreviewLanePresenter';
import { trackAlertPreviewMarkerFetchRetry } from 'in-alerting/components/Chart/AlertsPreviewLane/tracker';
import { pendingResult, emptyArray } from 'in-services/fixedObjects';
import { isLoading, hasError } from 'in-services/util/result';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export default function AlertsPreviewLanePropsChecker(props) {
  const { alertsPreviewConfiguration, getAlertsPreview } = props;
  if (!alertsPreviewConfiguration || !getAlertsPreview || !isConfigValid(alertsPreviewConfiguration)) {
    return null;
  }

  return <AlertsPreviewLane {...props} />;
}

function AlertsPreviewLane({
  alertsPreviewConfiguration,
  getAlertsPreview,
  resultMetricKey,
  isTearSheet,
  ...remainingProps
}) {
  const [retryCounter, setRetryCounter] = React.useState(0);

  const result =
    useObservable(getAlertsPreviewObservable, [
      getAlertsPreview,
      alertsPreviewConfiguration,
      remainingProps.clusterSizeMillis,
      resultMetricKey,
      // we use this counter also to trigger the reloading when the counter was changed.
      retryCounter
    ]) ?? pendingResult;

  const onRetry = () => {
    trackAlertPreviewMarkerFetchRetry(retryCounter + 1);
    setRetryCounter(retryCounter + 1);
  };

  return (
    <AlertsPreviewLanePresenter
      {...remainingProps}
      onRetry={isTearSheet ? undefined : onRetry}
      alerts={result?.data ?? emptyArray}
      errorMessage={hasError(result) ? getErrorMessage(isTearSheet) : undefined}
      isLoading={isLoading(result)}
    />
  );
}

function getErrorMessage(isTearSheet) {
  if (isTearSheet) {
    return t('in-alerting:components.chart.chartAlertsLaneErrorMessageForTearSheet');
  }
  return t('in-alerting:components.chart.chartAlertsLaneErrorMessage');
}

function isConfigValid({ granularity, threshold }) {
  const { type, baseline, value } = threshold;

  if (type === HISTORIC_BASELINE) {
    if ((baseline ?? []).length <= 1) {
      return false;
    }
    if (baseline[1][0] - baseline[0][0] !== granularity) {
      return false;
    }
  }

  if (type === ADAPTIVE_BASELINE) {
    return !((baseline ?? []).length === 0);
  }

  return !(type === STATIC_THRESHOLD && (value === undefined || value == null || value < 0));
}

AlertsPreviewLane.propTypes = {
  alertsPreviewConfiguration: PropTypes.object,
  getAlertsPreview: PropTypes.func,
  resultMetricKey: PropTypes.string,
  isTearSheet: PropTypes.bool
};

function getAlertsPreviewObservable([
  getAlertsPreview,
  alertsPreviewConfiguration,
  clusterSizeMillis,
  resultMetricKey
]) {
  return getAlertsPreview({ ...alertsPreviewConfiguration, granularity: clusterSizeMillis })
    .startWith(pendingResult)
    .map(result => {
      const alerts = isNotBlank(resultMetricKey)
        ? // when the result is a metric-map, pick the appropriate metric
          result.data?.[resultMetricKey]
        : // when the result is just a single metric
          result.data;
      return {
        ...result,
        data: alerts?.map(([timestamp, count]) => ({ timestamp, count })) ?? []
      };
    });
}
