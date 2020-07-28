import PropTypes from 'prop-types';
import theme from 'in-themes';
import React from 'react';

import SingleIconLaneItem from 'in-components/Chart/markerLanes/MarkerLane/SingleIconLaneItem';
import MarkerLane from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import HoverLine from 'in-components/Chart/markerLanes/MarkerLane/HoverLine';
import HoverArea from 'in-components/Chart/markerLanes/MarkerLane/HoverArea';

import locals from './AlertsPreviewLanePresenter.mless';

export default function AlertsPreviewLanePresenter({ alerts, ...remainingProps }) {
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
      tooltipContent={({ count }) => (
        <div className={locals.tooltipContent}>
          <div>Alerts: {count}</div>
        </div>
      )}
      renderLaneItem={SingleIconLaneItem}
      renderHoverOverlay={remainingProps.isClustered ? HoverArea : HoverLine}
    />
  );
}

AlertsPreviewLanePresenter.propTypes = {
  alerts: PropTypes.array.isRequired
};
