/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { useObservable } from '@instana/hooks';

import CDEventsLanePresenter from 'in-components/Chart/markerLanes/CDEventsLane/CDEventsLanePresenter';
import { pendingResult, emptyArray } from 'in-services/fixedObjects';
import getCDEvents from 'in-events/subscriptions/getCDEvents';
import { propTypeTimeConfig } from 'in-stores/time/config';

export default function CDEventsLaneLanePropsChecker(props) {
  if (!props.clusterSizeMillis || !props.timeConfig || !props.snapshotId) {
    return null;
  }
  return <CDEventsLane {...props} />;
}
function CDEventsLane(props) {
  const { timeConfig, clusterSizeMillis, snapshotId } = props;
  const cdEvents = useObservable(getCDEventsObservable, [timeConfig, clusterSizeMillis, snapshotId]) ?? emptyArray;

  return <CDEventsLanePresenter {...props} cdEvents={cdEvents} />;
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

CDEventsLane.propTypes = {
  clusterSizeMillis: PropTypes.number,
  timeConfig: propTypeTimeConfig,
  snapshotId: PropTypes.string
};

function getCDEventsObservable([timeConfig, clusterSizeMillis, snapshotId]) {
  return getCDEvents({
    timeConfig: cleanUpChartTimeConfig(timeConfig),
    granularity: clusterSizeMillis,
    snapshotId: snapshotId
  })
    .startWith(pendingResult)
    .map(({ data }) => data);
}
