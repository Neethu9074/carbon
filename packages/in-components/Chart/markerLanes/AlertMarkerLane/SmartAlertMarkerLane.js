import PropTypes from 'prop-types';
import React from 'react';

import SmartAlertMarkerLanePresenter from 'in-components/Chart/markerLanes/AlertMarkerLane/SmartAlertMarkerLanePresenter';
import { pendingResult, emptyArray } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';

export default function SmartAlertMarkerLane({ alertsPreviewConfiguration, getAlertsPreview, ...remainingProps }) {
  const { clusterGranularity } = remainingProps;

  const alerts =
    useObservable(getAlertsPreview({ ...alertsPreviewConfiguration, clusterGranularity }).startWith(pendingResult), [
      alertsPreviewConfiguration,
      getAlertsPreview
    ]) ?? emptyArray;

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
  alertsPreviewConfiguration: PropTypes.object.isRequired,
  getAlertsPreview: PropTypes.func.isRequired
};
