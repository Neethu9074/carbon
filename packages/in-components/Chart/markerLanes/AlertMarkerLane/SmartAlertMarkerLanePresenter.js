import PropTypes from 'prop-types';
import theme from 'in-themes';
import React from 'react';

import MarkerLane from 'in-components/Chart/markerLanes/MarkerLane';
import { formatDateTime } from 'in-services/formatters/date';

import locals from './SmartAlertMarkerLanePresenter.mless';

export default function SmartAlertMarkerLanePresenter({ alerts, ...remainingProps }) {
  return (
    <MarkerLane
      {...remainingProps}
      events={alerts}
      label="Alerts"
      iconConfig={{
        type: 'lib_events_warning',
        typeCluster: 'lib_alerts_multiple_alerts',
        color: theme.lib.colors.red800
      }}
      tooltipContent={({ start, numAlertsInCluster }) => {
        return (
          <div className={locals.tooltipContent}>
            <time dateTime={new Date(start).toISOString()}>{formatDateTime(start)}</time>
            <div>Alerts: {numAlertsInCluster}</div>
          </div>
        );
      }}
    />
  );
}

SmartAlertMarkerLanePresenter.propTypes = {
  alerts: PropTypes.array.isRequired
};
