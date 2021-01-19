/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import AlertsLanePresenter from 'in-components/Chart/markerLanes/AlertsLane/AlertsLanePresenter';
import { pendingResult, emptyArray } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import useObservable from 'in-hooks/useObservable';

export default function AlertsLane({ getAlerts, config = {}, ...remainingProps }) {
  const { clusterSizeMillis } = remainingProps;

  const alertsResult =
    useObservable(getAlertsObservable, [getAlerts, config, clusterSizeMillis, remainingProps.timeConfig]) ?? emptyArray;

  return (
    <AlertsLanePresenter {...remainingProps} alerts={alertsResult?.data ?? []} isLoading={isLoading(alertsResult)} />
  );
}

AlertsLane.propTypes = {
  getAlerts: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired
};

function getAlertsObservable([getAlerts, config, clusterSizeMillis, timeConfig]) {
  return getAlerts({
    granularity: clusterSizeMillis,
    timeConfig: timeConfig,
    ...config
  }).startWith(pendingResult);
}
