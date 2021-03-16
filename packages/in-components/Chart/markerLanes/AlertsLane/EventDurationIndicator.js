/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { alertsLaneAlertsPropType } from 'in-components/Chart/markerLanes/AlertsLane/constants';

import locals from './EventDurationIndicator.mless';

export default function EventDurationIndicator({ color, timeAxisHeight, chartHeight, eventData, xScale }) {
  const sortedEvents = [eventData.smartAlerts[0], eventData.incidents[0]]
    .sort((a, b) => a.triggeringTime - b.triggeringTime)
    .sort((a, b) => a.duration - b.duration);

  const oldestEvent = sortedEvents[0];
  const { triggeringTime, start, end, duration, adjustedTriggeringTime, adjustedStart } = oldestEvent ?? {};

  const xPosTriggering = xScale?.getRange(adjustedTriggeringTime || triggeringTime);
  const xPosStart = xScale?.getRange(adjustedStart || start);
  const xPosEnd = end && xScale?.getRange(end);
  const durationWidth = duration ? xScale?.getRangeArea(duration) : null;

  if (durationWidth < 10) {
    return null;
  }

  return (
    <div className={locals.eventDurationIndicatorWrapper} style={{ color, top: chartHeight - timeAxisHeight + 2 }}>
      <div className={locals.triggeringTimeIndicator} style={getTransformTranslateX(xPosTriggering)} />
      <div className={locals.startIndicator} style={getTransformTranslateX(xPosStart)} />
      <div
        className={locals.eventDuration}
        style={{ ...getTransformTranslateX(xPosTriggering), width: durationWidth }}
      />
      {end && <div className={locals.endIndicator} style={getTransformTranslateX(xPosEnd)} />}
    </div>
  );
}
function getTransformTranslateX(xPos) {
  return { transform: `translateX(${xPos}px)` };
}

EventDurationIndicator.propTypes = {
  chartHeight: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  eventData: PropTypes.shape({
    incidents: PropTypes.arrayOf(alertsLaneAlertsPropType).isRequired,
    smartAlerts: PropTypes.arrayOf(alertsLaneAlertsPropType).isRequired,
    timestamp: PropTypes.number.isRequired
  }).isRequired,
  timeAxisHeight: PropTypes.number.isRequired,
  xScale: PropTypes.shape({
    getRange: PropTypes.func.isRequired,
    getRangeArea: PropTypes.func.isRequired
  }).isRequired
};
