/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { AlertClusterResponse, Nullish } from 'in-types';
import { ScaleType } from 'in-services/scale/scale';

import locals from './EventDurationIndicator.mless';

interface EventDurationIndicatorProps {
  chartHeight?: number | undefined;
  color?: string;
  eventData: AlertClusterResponse;
  timeAxisHeight?: number;
  xScale: ScaleType | Nullish;
}

export default function EventDurationIndicator({
  color,
  timeAxisHeight,
  chartHeight,
  eventData,
  xScale
}: EventDurationIndicatorProps) {
  const sortedEvents = [eventData?.smartAlerts[0], eventData?.incidents[0]]
    .sort((a, b) => a.triggeringTime - b.triggeringTime)
    .sort((a, b) => (a.duration && b.duration ? a.duration - b.duration : 0));

  const oldestEvent = sortedEvents[0];
  const { triggeringTime, start, end, duration, adjustedTriggeringTime, adjustedStart } = oldestEvent ?? {};

  const xPosTriggering = xScale?.getRange(adjustedTriggeringTime || triggeringTime) ?? 0;
  const xPosStart = xScale?.getRange(adjustedStart || start) ?? 0;
  const xPosEnd = (end && xScale?.getRange(end)) ?? 0;
  const durationWidth = duration ? xScale?.getRangeArea(duration) : null;
  if (durationWidth && durationWidth < 10) {
    return null;
  }

  return (
    <div
      className={locals.eventDurationIndicatorWrapper}
      style={{ color, top: chartHeight && timeAxisHeight ? chartHeight - timeAxisHeight + 2 : 0 }}
    >
      <div className={locals.triggeringTimeIndicator} style={getTransformTranslateX(xPosTriggering)} />
      <div className={locals.startIndicator} style={getTransformTranslateX(xPosStart)} />
      <div
        className={locals.eventDuration}
        style={{ ...getTransformTranslateX(xPosTriggering), width: durationWidth ?? undefined }}
      />
      {end && <div className={locals.endIndicator} style={getTransformTranslateX(xPosEnd)} />}
    </div>
  );
}
function getTransformTranslateX(xPos: number) {
  return { transform: `translateX(${xPos}px)` };
}
