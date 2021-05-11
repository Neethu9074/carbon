/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { Li, Ul } from '@instana/components';

import { alertsLaneAlertsPropType } from 'in-components/Chart/markerLanes/AlertsLane/constants';
import TwoIconsLaneItem from 'in-components/Chart/markerLanes/MarkerLane/TwoIconsLaneItem';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import MarkerLane from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import HoverArea from 'in-components/Chart/markerLanes/MarkerLane/HoverArea';
import HoverLine from 'in-components/Chart/markerLanes/MarkerLane/HoverLine';
import LaneIcon from 'in-components/Chart/markerLanes/MarkerLane/LaneIcon';
import AlertsLaneTooltipContent from './AlertsLaneTooltipContent';
import EventDurationIndicator from './EventDurationIndicator';
import { formatDateTime } from 'in-services/formatters/date';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './AlertsLanePresenter.mless';

export default function AlertsLanePresenter({ alerts, ...remainingProps }) {
  return (
    <>
      <MarkerLane
        {...remainingProps}
        events={alerts}
        label={t('in-components:chart.chartAlertsLanePresenterAlertsLabel')}
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
        color={theme.lib.colors.red800}
        TooltipContent={AlertsLaneTooltipContent}
        LaneItem={TwoIconsLaneItem}
        HoverOverlay={remainingProps.isClustered ? HoverArea : HoverLine}
        calloutContent={props => <AlertListCallout {...props} />}
        SecondaryHoverOverlay={EventDurationIndicator}
        renderMarkerItem={LaneIcon}
      />
    </>
  );
}

function AlertListCallout({ iconConfig, eventData, timeConfig }) {
  const { incidents, smartAlerts } = eventData;
  const enahncedAndSortedEvents = [
    ...incidents.map(incident => ({ ...incident, iconType: 'lib_events_incident' })),
    ...smartAlerts.map(incident => ({ ...incident, iconType: 'lib_events_warning' }))
  ].sort((a, b) => a.start - b.start);

  return (
    <Ul className={locals.list}>
      {enahncedAndSortedEvents.map(({ name, start, eventId, iconType }, index) => {
        return (
          <ListItem
            key={`${index}${name}${start}`}
            start={start}
            iconConfig={iconConfig}
            name={name}
            iconType={iconType}
            eventId={eventId}
            timeConfig={timeConfig}
          />
        );
      })}
    </Ul>
  );
}

function ListItem({ start, iconConfig, name, iconType, ...remainingProps }) {
  return (
    <Li className={locals.listItem} href$={getLinkToEventsList(remainingProps)}>
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
