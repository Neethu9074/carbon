import PropTypes from 'prop-types';
import theme from 'in-themes';
import React from 'react';

import SingleMarkerLaneItem from 'in-components/Chart/markerLanes/MarkerLane/SingleMarkerLaneItem';
import MarkerLane from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import HoverLine from 'in-components/Chart/markerLanes/MarkerLane/HoverLine';
import HoverArea from 'in-components/Chart/markerLanes/MarkerLane/HoverArea';
import LaneIcon from 'in-components/Chart/markerLanes/MarkerLane/LaneIcon';

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
      color={theme.lib.colors.red800}
      tooltipContent={({ count }) => (
        <div className={locals.tooltipContent}>
          <div>Alerts: {count}</div>
        </div>
      )}
      LaneItem={SingleMarkerLaneItem}
      renderHoverOverlay={remainingProps.isClustered ? HoverArea : HoverLine}
      renderMarkerItem={LaneIcon}
    />
  );
}

AlertsPreviewLanePresenter.propTypes = {
  alerts: PropTypes.array.isRequired
};
