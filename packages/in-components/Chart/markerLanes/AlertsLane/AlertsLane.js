import PropTypes from 'prop-types';
import React from 'react';

import AlertsLanePresenter from 'in-components/Chart/markerLanes/AlertsLane/AlertsLanePresenter';
import { pendingResult, emptyArray } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';

export default function AlertsLane({ getAlerts, config = {}, ...remainingProps }) {
  const { clusterSizeMillis } = remainingProps;

  const alerts =
    useObservable(
      getAlerts({
        granularity: clusterSizeMillis,
        timeConfig: remainingProps.timeConfig,
        ...config
      })
        .startWith(pendingResult)
        .map(({ data = [] }) => data),
      [getAlerts]
    ) ?? emptyArray;

  return <AlertsLanePresenter {...remainingProps} alerts={alerts} />;
}

AlertsLane.propTypes = {
  getAlerts: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired
};
