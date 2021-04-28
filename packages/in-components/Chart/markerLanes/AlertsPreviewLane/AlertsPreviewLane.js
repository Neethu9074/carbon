/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';
import PropTypes from 'prop-types';
import React from 'react';

import AlertsPreviewLanePresenter from 'in-components/Chart/markerLanes/AlertsPreviewLane/AlertsPreviewLanePresenter';
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
  if (threshold.type === 'historicBaseline') {
    if (threshold.baseline == null || threshold.baseline?.length <= 1) {
      return false;
    }
    if (threshold.baseline[1][0] - threshold.baseline[0][0] !== granularity) {
      return false;
    }
  }
  return !(
    threshold.type === 'staticThreshold' &&
    (threshold.value === undefined || threshold.value == null || threshold.value < 0)
  );
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
