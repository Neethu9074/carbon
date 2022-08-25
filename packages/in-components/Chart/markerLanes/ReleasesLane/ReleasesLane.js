/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';
import PropTypes from 'prop-types';
import React from 'react';

import ReleasesLanePresenter from 'in-components/Chart/markerLanes/ReleasesLane/ReleasesLanePresenter';
import getReleaseClusters from 'in-events/subscriptions/getReleaseClusters';
import { pendingResult, emptyArray } from 'in-services/fixedObjects';
import { propTypeTimeConfig } from 'in-stores/time/config';

export default function ReleasesLanePropsChecker(props) {
  if (!props.clusterSizeMillis || !props.timeConfig) {
    return null;
  }
  return <ReleasesLane {...props} />;
}
function ReleasesLane(props) {
  const { timeConfig, clusterSizeMillis, serviceId, applicationId } = props;
  const releases =
    useObservable(getReleaseClustersObservable, [timeConfig, clusterSizeMillis, serviceId, applicationId]) ??
    emptyArray;

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
  serviceId: PropTypes.string,
  applicationId: PropTypes.string
};

function getReleaseClustersObservable([timeConfig, clusterSizeMillis, serviceId, applicationId]) {
  return getReleaseClusters({
    timeConfig: cleanUpChartTimeConfig(timeConfig),
    granularity: clusterSizeMillis,
    serviceId: serviceId,
    applicationId: applicationId
  })
    .startWith(pendingResult)
    .map(({ data }) => data);
}
