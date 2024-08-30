/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { themes } from '@instana/design-tokens';
import { SvgIcon } from '@instana/components';
import { Li, Ul } from '@instana/components';

import AlertsLaneTooltipContent from 'in-components/Chart/markerLanes/AlertsLane/AlertsLaneTooltipContent';
import EventDurationIndicator from 'in-components/Chart/markerLanes/AlertsLane/EventDurationIndicator';
import { alertsLaneAlertsPropType } from 'in-components/Chart/markerLanes/AlertsLane/constants';
import TwoIconsLaneItem from 'in-components/Chart/markerLanes/MarkerLane/TwoIconsLaneItem';
import { useGetEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import MarkerLane from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import HoverArea from 'in-components/Chart/markerLanes/MarkerLane/HoverArea';
import HoverLine from 'in-components/Chart/markerLanes/MarkerLane/HoverLine';
import LaneIcon from 'in-components/Chart/markerLanes/MarkerLane/LaneIcon';
import { formatDateTime } from 'in-services/formatters/date';
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
            type: 'lib_events_critical',
            typeCluster: 'lib_alerts_multiple_alerts',
            color: themes.default.ids.color.option.red['500']
          },
          incidents: {
            type: 'lib_events_incident',
            typeCluster: 'lib_alerts_multiple_alerts',
            color: themes.default.ids.color.option.red['500']
          }
        }}
        color={themes.default.ids.color.option.red['500']}
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
    ...smartAlerts.map(incident => ({ ...incident, iconType: 'lib_events_critical' }))
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
  const { eventId, timeConfig } = remainingProps;
  const { getEventsViewFilteredBy } = useGetEventsViewFilteredBy();
  const href = getEventsViewFilteredBy({
    eventId,
    timeConfig
  });

  return (
    <Li className={locals.listItem} href={href}>
      <SvgIcon type={iconType} color={iconConfig.color} />
      <div style={{ marginLeft: '12px' }}>
        <time dateTime={new Date(start).toISOString()}>{formatDateTime(start)}</time>
        <div className={locals.name}>{`${name.trim()}`}</div>
      </div>
    </Li>
  );
}

AlertsLanePresenter.propTypes = {
  alerts: PropTypes.arrayOf(alertsLaneAlertsPropType),
  isClustered: PropTypes.bool
};
