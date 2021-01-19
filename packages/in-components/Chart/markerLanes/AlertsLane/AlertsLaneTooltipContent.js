/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import { alertsLaneAlertsPropType } from 'in-components/Chart/markerLanes/AlertsLane/constants';
import { formatDateTime } from 'in-services/formatters/date';

import locals from './AlertsLaneTooltipContent.mless';

export default function AlertsLaneTooltipContent({ smartAlerts = [], incidents = [] }) {
  const smartAlertsCount = smartAlerts?.length;
  const incidentsCount = incidents?.length;

  const hasSmartAlerts = !!smartAlertsCount;
  const hasIcidents = !!incidentsCount;

  return (
    <>
      {hasIcidents && hasSmartAlerts ? (
        <div>{`${smartAlertsCount} Smart Alert${smartAlertsCount > 1 ? 's' : ''} & ${incidentsCount} Incident${
          incidentsCount > 1 ? 's' : ''
        }`}</div>
      ) : (
        <>
          <TooltipItem events={smartAlerts} moreMessageTypeText="Smart Alert" />
          <TooltipItem events={incidents} moreMessageTypeText="Incident" />
        </>
      )}
    </>
  );
}

AlertsLaneTooltipContent.propTypes = {
  incidents: PropTypes.arrayOf(alertsLaneAlertsPropType).isRequired,
  smartAlerts: PropTypes.arrayOf(alertsLaneAlertsPropType).isRequired
};

function TooltipItem({ events, moreMessageTypeText }) {
  if (events.length === 0) return null;

  const visibleItemsCount = 2;
  const eventsCount = events.length;

  return (
    <>
      <div className={locals.tooltipContent}>
        {events.slice(0, visibleItemsCount).map(({ name, start }, i) => (
          <div key={`${start}${i}`}>
            <time dateTime={new Date(start).toISOString()}>{formatDateTime(start)}</time>
            <div className={locals.name}>{`${name}`}</div>
          </div>
        ))}
      </div>
      {eventsCount > visibleItemsCount && (
        <div>{`+${eventsCount - visibleItemsCount} more ${moreMessageTypeText}${eventsCount > 1 ? 's' : ''}`}</div>
      )}
    </>
  );
}
