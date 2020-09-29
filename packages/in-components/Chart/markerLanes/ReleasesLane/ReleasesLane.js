import PropTypes from 'prop-types';
import React from 'react';

import ReleasesLanePresenter from 'in-components/Chart/markerLanes/ReleasesLane/ReleasesLanePresenter';
import getReleaseClusters from 'in-events/subscriptions/getReleaseClusters';
import { pendingResult, emptyArray } from 'in-services/fixedObjects';
import { propTypeTimeConfig } from 'in-stores/time/config';
import useObservable from 'in-hooks/useObservable';

export default function ReleasesLane(props) {
  if (!props.clusterSizeMillis || !props.timeConfig) return null;

  const releases =
    useObservable(
      getReleaseClusters({
        timeConfig: cleanUpChartTimeConfig(props.timeConfig),
        granularity: props.clusterSizeMillis,
        serviceId: props.serviceId
      })
        .startWith(pendingResult)
        .map(({ data }) => data),
      [props.timeConfig, props.clusterSizeMillis, props.serviceId]
    ) ?? emptyArray;

  return <ReleasesLanePresenter {...props} releases={releases} />;
}

/**
 *
 * we need this function because in non-live mode we need to use the chart-time-config,
 * which needs to be put in a valid state for the request
 */
function cleanUpChartTimeConfig(timeConfig) {
  if (timeConfig.to !== timeConfig.focusedMoment) {
    return { ...timeConfig, focusedMoment: timeConfig.to };
  }
  return timeConfig;
}

ReleasesLane.propTypes = {
  clusterSizeMillis: PropTypes.number,
  timeConfig: propTypeTimeConfig,
  serviceId: PropTypes.string
};
