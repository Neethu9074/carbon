/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { useObservable } from '@instana/hooks';

import AlertsPreviewLanePresenter from 'in-components/Chart/markerLanes/AlertsPreviewLane/AlertsPreviewLanePresenter';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { pendingResult, emptyArray } from 'in-services/fixedObjects';

export default function AlertsPreviewLanePropsChecker(props) {
  const { alertsPreviewConfiguration, getAlertsPreview } = props;
  if (!alertsPreviewConfiguration || !getAlertsPreview || !isConfigValid(alertsPreviewConfiguration)) {
    return null;
  }

  return <AlertsPreviewLane {...props} />;
}

function AlertsPreviewLane({ alertsPreviewConfiguration, getAlertsPreview, ...remainingProps }) {
  const alerts =
    useObservable(getAlertsPreviewObservable, [
      getAlertsPreview,
      alertsPreviewConfiguration,
      remainingProps.clusterSizeMillis
    ]) ?? emptyArray;

  return <AlertsPreviewLanePresenter {...remainingProps} alerts={alerts} />;
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
  getAlertsPreview: PropTypes.func
};

function getAlertsPreviewObservable([getAlertsPreview, alertsPreviewConfiguration, clusterSizeMillis]) {
  return getAlertsPreview({ ...alertsPreviewConfiguration, granularity: clusterSizeMillis })
    .startWith(pendingResult)
    .map(
      ({ data }) =>
        data?.alerts.map(([timestamp, count]) => ({
          timestamp,
          count
        })) ?? []
    );
}
