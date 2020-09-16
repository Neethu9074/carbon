import PropTypes from 'prop-types';
import React from 'react';

import PotentialProblemsLane from 'in-new-components/PotentialProblems/PotentialProblemsLane/PotentialProblemsLane';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import getApplicationAlertClusters from '../subscriptions/getApplicationAlertClusters';
import ReleasesLane from 'in-components/Chart/markerLanes/ReleasesLane/ReleasesLane';
import AlertsLane from 'in-components/Chart/markerLanes/AlertsLane/AlertsLane';

export default function ApplicationDashboardsMarkerLanes({
  applicationId,
  serviceId,
  endpointId,
  showPotentialProblemsLane = false,
  ...remainingProps
}) {
  return function MarkerLanesApplications(lanesProps) {
    return (
      <MarkerLanesPresenter {...lanesProps}>
        <ReleasesLane />
        <AlertsLane
          getAlerts={getApplicationAlertClusters}
          config={{
            applicationId,
            endpointId,
            serviceId
          }}
        />
        {showPotentialProblemsLane ? (
          <PotentialProblemsLane
            {...remainingProps}
            applicationId={applicationId}
            serviceId={serviceId}
            endpointId={endpointId}
          />
        ) : null}
      </MarkerLanesPresenter>
    );
  };
}

ApplicationDashboardsMarkerLanes.propTypes = {
  applicationId: PropTypes.string.isRequired,
  endpointId: PropTypes.string,
  serviceId: PropTypes.string,
  showPotentialProblemsLane: PropTypes.element
};
