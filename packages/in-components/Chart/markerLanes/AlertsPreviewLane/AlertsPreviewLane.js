import PropTypes from 'prop-types';
import React from 'react';

import AlertsPreviewLanePresenter from 'in-components/Chart/markerLanes/AlertsPreviewLane/AlertsPreviewLanePresenter';
import { pendingResult, emptyArray } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';

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

function isConfigValid({ threshold }) {
  if (threshold.type === 'historicBaseline' && (threshold.baseline == null || threshold.baseline?.length === 0)) {
    return false;
  }
  if (
    threshold.type === 'staticThreshold' &&
    (threshold.value === undefined || threshold.value == null || threshold.value < 0)
  ) {
    return false;
  }
  return true;
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
