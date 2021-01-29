/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import theme from 'in-themes';
import { t } from 'in-i18n';
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
      label={t('in-components:chart.chartAlertsPreviewLanePresenterAlertsLabel')}
      iconConfig={{
        type: 'lib_events_warning',
        typeCluster: 'lib_alerts_multiple_alerts',
        color: theme.lib.colors.red800
      }}
      color={theme.lib.colors.red800}
      TooltipContent={({ count }) => (
        <div className={locals.tooltipContent}>
          <div>Alerts: {count}</div>
        </div>
      )}
      LaneItem={SingleMarkerLaneItem}
      HoverOverlay={remainingProps.isClustered ? HoverArea : HoverLine}
      renderMarkerItem={LaneIcon}
    />
  );
}

AlertsPreviewLanePresenter.propTypes = {
  alerts: PropTypes.array.isRequired
};
