import PropTypes from 'prop-types';
import React from 'react';

import AlertsLanePresenter from 'in-components/Chart/markerLanes/AlertsLane/AlertsLanePresenter';
import { pendingResult, emptyArray } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import useObservable from 'in-hooks/useObservable';

export default function AlertsLane({ getAlerts, config = {}, ...remainingProps }) {
  const { clusterSizeMillis } = remainingProps;

  const alertsResult =
    useObservable(
      getAlerts({
        granularity: clusterSizeMillis,
        timeConfig: remainingProps.timeConfig,
        ...config
      }).startWith(pendingResult),
      [config, clusterSizeMillis, remainingProps.timeConfig]
    ) ?? emptyArray;

  return (
    <AlertsLanePresenter {...remainingProps} alerts={alertsResult?.data ?? []} isLoading={isLoading(alertsResult)} />
  );
}

AlertsLane.propTypes = {
  getAlerts: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired
};
