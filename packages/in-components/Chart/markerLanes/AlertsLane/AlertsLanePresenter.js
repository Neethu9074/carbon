import PropTypes from 'prop-types';
import theme from 'in-themes';
import React from 'react';

import { alertsLaneAlertsPropType } from 'in-components/Chart/markerLanes/AlertsLane/constants';
import TwoIconsLaneItem from 'in-components/Chart/markerLanes/MarkerLane/TwoIconsLaneItem';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import MarkerLane from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import HoverLine from 'in-components/Chart/markerLanes/MarkerLane/HoverLine';
import HoverArea from 'in-components/Chart/markerLanes/MarkerLane/HoverArea';
import AlertsLaneTooltipContent from './AlertsLaneTooltipContent';
import EventDurationIndicator from './EventDurationIndicator';
import { formatDateTime } from 'in-services/formatters/date';
import { Li, Ul } from 'in-new-components/lists/List';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './AlertsLanePresenter.mless';

export default function AlertsLanePresenter({ alerts, ...remainingProps }) {
  return (
    <>
      <MarkerLane
        {...remainingProps}
        events={alerts}
        label="Alerts"
        iconConfigForMultipleAlertTypes={{
          smartAlerts: {
            type: 'lib_events_warning',
            typeCluster: 'lib_alerts_multiple_alerts',
            color: theme.lib.colors.red800
          },
          incidents: {
            type: 'lib_events_incident',
            typeCluster: 'lib_alerts_multiple_alerts',
            color: theme.lib.colors.red800
          }
        }}
        tooltipContent={AlertsLaneTooltipContent}
        renderLaneItem={TwoIconsLaneItem}
        renderHoverOverlay={remainingProps.isClustered ? HoverArea : HoverLine}
        calloutContent={({ iconConfig, eventData, timeConfig }) => {
          const { incidents, smartAlerts } = eventData;
          const enahncedAndSortedEvents = [
            ...incidents.map(incident => ({ ...incident, iconType: 'lib_events_warning' })),
            ...smartAlerts.map(incident => ({ ...incident, iconType: 'lib_events_incident' }))
          ].sort((a, b) => a.start - b.start);

          return (
            <Ul className={locals.list}>
              {enahncedAndSortedEvents.map(({ name, start, eventId, iconType }) =>
                ListItem({ start, iconConfig, name, iconType, eventId, timeConfig })
              )}
            </Ul>
          );
        }}
        renderSecondaryHoverOverlay={EventDurationIndicator}
      />
    </>
  );
}

function ListItem({ start, iconConfig, name, iconType, ...remainingProps }) {
  return (
    <Li key={`${start}${iconType}`} className={locals.listItem} href$={getLinkToEventsList(remainingProps)}>
      <SvgIcon type={iconType} color={iconConfig.color} />
      <div style={{ marginLeft: '12px' }}>
        <time dateTime={new Date(start).toISOString()}>{formatDateTime(start)}</time>
        <div className={locals.name}>{`${name.trim()}`}</div>
      </div>
    </Li>
  );
}

function getLinkToEventsList({ eventId, timeConfig }) {
  return getEventsViewFilteredBy({
    eventId,
    timeConfig
  });
}
AlertsLanePresenter.propTypes = {
  alerts: PropTypes.arrayOf(alertsLaneAlertsPropType),
  isClustered: PropTypes.bool
};
