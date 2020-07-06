import PropTypes from 'prop-types';
import React from 'react';

import ReleaseMarkerLanePresenter from 'in-components/Chart/markerLanes/ReleaseMarkerLane/ReleaseMarkerLanePresenter';
import getReleaseClusters from 'in-events/subscriptions/getReleaseClusters';
import { pendingResult, emptyArray } from 'in-services/fixedObjects';
import { propTypeTimeConfig } from 'in-stores/time/config';
import useObservable from 'in-hooks/useObservable';

export default function ReleaseMarkerLane(props) {
  if (!props.clusterSizeMillis || !props.timeConfig) return null;
  const releases =
    useObservable(
      getReleaseClusters({
        timeConfig: props.timeConfig,
        granularity: props.clusterSizeMillis
      })
        .startWith(pendingResult)
        .map(({ data = [] }) => data),
      [props.timeConfig]
    ) ?? emptyArray;

  return <ReleaseMarkerLanePresenter {...props} releases={releases} />;
}

ReleaseMarkerLane.propTypes = {
  clusterSizeMillis: PropTypes.number,
  timeConfig: propTypeTimeConfig
};
