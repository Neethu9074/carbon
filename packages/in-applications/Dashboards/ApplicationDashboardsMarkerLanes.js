/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import PotentialProblemsLane from 'in-alerting/PotentialProblems/PotentialProblemsLane/PotentialProblemsLane';
import getApplicationAlertClusters from 'in-applications/subscriptions/getApplicationAlertClusters';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import ReleasesLane from 'in-components/Chart/markerLanes/ReleasesLane/ReleasesLane';
import AlertsLane from 'in-components/Chart/markerLanes/AlertsLane/AlertsLane';
import { potentialProblemsEnabled } from 'in-services/featureFlags';

export default function ApplicationDashboardsMarkerLanes({
  applicationId,
  serviceId,
  endpointId,
  includeSyntheticCalls,
  showPotentialProblemsLane = false,
  ...remainingProps
}) {
  return function MarkerLanesApplications(lanesProps) {
    return (
      <MarkerLanesPresenter {...lanesProps}>
        <ReleasesLane serviceId={serviceId} applicationId={applicationId} />
        <AlertsLane
          getAlerts={getApplicationAlertClusters}
          config={{
            applicationId,
            endpointId,
            serviceId
          }}
        />
        {showPotentialProblemsLane && potentialProblemsEnabled && (
          <PotentialProblemsLane
            {...remainingProps}
            applicationId={applicationId}
            serviceId={serviceId}
            endpointId={endpointId}
            includeSynthetic={includeSyntheticCalls}
          />
        )}
      </MarkerLanesPresenter>
    );
  };
}

ApplicationDashboardsMarkerLanes.propTypes = {
  applicationId: PropTypes.string.isRequired,
  endpointId: PropTypes.string,
  serviceId: PropTypes.string,
  includeSyntheticCalls: PropTypes.bool,
  showPotentialProblemsLane: PropTypes.element
};
