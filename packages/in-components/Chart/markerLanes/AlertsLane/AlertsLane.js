import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AlertsLanePresenter from 'in-components/Chart/markerLanes/AlertsLane/AlertsLanePresenter';
import { pendingResult, emptyArray } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';

export default function AlertsLane({ getAlerts, config = {}, ...remainingProps }) {
  const [isLoading, setIsLoading] = useState(true);
  const { clusterSizeMillis } = remainingProps;

  const alerts =
    useObservable(
      getAlerts({
        granularity: clusterSizeMillis,
        timeConfig: remainingProps.timeConfig,
        ...config
      })
        .startWith(pendingResult)
        .tap(({ progress }) => {
          if (!progress.loading) setIsLoading(false);
        })
        .map(({ data = [] }) => data),
      [config, clusterSizeMillis, remainingProps.timeConfig]
    ) ?? emptyArray;

  return <AlertsLanePresenter {...remainingProps} alerts={alerts} isLoading={isLoading} />;
}

AlertsLane.propTypes = {
  getAlerts: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired
};
