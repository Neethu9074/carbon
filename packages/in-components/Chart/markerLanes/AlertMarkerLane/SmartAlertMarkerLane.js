import PropTypes from 'prop-types';
import React from 'react';

import SmartAlertMarkerLanePresenter from 'in-components/Chart/markerLanes/AlertMarkerLane/SmartAlertMarkerLanePresenter';
import { pendingResult, emptyArray } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';

export default function SmartAlertMarkerLane({ alertsPreviewConfiguration, getAlertsPreview, ...remainingProps }) {
  if (!alertsPreviewConfiguration || !getAlertsPreview) return null;

  const { clusterSizeMillis } = remainingProps;
  const alerts =
    useObservable(
      getAlertsPreview({ ...alertsPreviewConfiguration, granularity: clusterSizeMillis })
        .startWith(pendingResult)
        .map(
          ({ data }) =>
            data?.alerts.map(([startTime, count]) => ({
              startTime,
              count
            })) ?? []
        ),
      [alertsPreviewConfiguration, getAlertsPreview]
    ) ?? emptyArray;

  return (
    <SmartAlertMarkerLanePresenter
      {...{
        ...remainingProps,
        alerts
      }}
    />
  );
}

SmartAlertMarkerLane.propTypes = {
  alertsPreviewConfiguration: PropTypes.object,
  getAlertsPreview: PropTypes.func
};
