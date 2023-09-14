/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { useTheme } from '@instana/components';

import SingleMarkerLaneItem from 'in-components/Chart/markerLanes/MarkerLane/SingleMarkerLaneItem';
import MarkerLane from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import HoverLine from 'in-components/Chart/markerLanes/MarkerLane/HoverLine';
import HoverArea from 'in-components/Chart/markerLanes/MarkerLane/HoverArea';
import LaneIcon from 'in-components/Chart/markerLanes/MarkerLane/LaneIcon';
import { t } from 'in-i18n';

import locals from './AlertsPreviewLanePresenter.mless';

export default function AlertsPreviewLanePresenter({ alerts, isLoading, ...remainingProps }) {
  const theme = useTheme();

  const alertsPreviewLaneLabel = getLaneLabel(alerts, isLoading);
  return (
    <MarkerLane
      {...remainingProps}
      isLoading={isLoading}
      events={alerts}
      alwaysDisplayLabels={alerts && alerts.length === 0}
      label={alertsPreviewLaneLabel}
      iconConfig={{
        type: 'lib_events_critical',
        typeCluster: 'lib_alerts_multiple_alerts',
        color: theme.ids.color.option.red['500']
      }}
      color={theme.ids.color.option.red['500']}
      TooltipContent={({ count }) => (
        <div className={locals.tooltipContent}>
          <div>
            {t('in-alerting:components.chart.chartAlertsPreviewLanePresenterTooltip', {
              count
            })}
          </div>
        </div>
      )}
      LaneItem={SingleMarkerLaneItem}
      HoverOverlay={remainingProps.isClustered ? HoverArea : HoverLine}
      renderMarkerItem={LaneIcon}
    />
  );
}

function getLaneLabel(alerts, isLoading) {
  if (isLoading || !alerts) {
    // do not show any label while loading, because this causes additional flickering of the alert line while loading the chart
    // because the parent chart component is re-rendered multiple times
    return null;
  }
  return alerts.length > 0
    ? t('in-alerting:components.chart.chartAlertsPreviewLanePresenterAlertsLabel')
    : t('in-alerting:components.chart.chartAlertsPreviewLanePresenterNoAlertsLabel');
}

AlertsPreviewLanePresenter.propTypes = {
  alerts: PropTypes.array,
  isLoading: PropTypes.bool
};
