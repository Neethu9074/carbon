/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getInfraGranularity } from 'in-stores/metric';
import { EventOrMap, EventMap } from 'in-events/types';
import { minutes } from 'in-services/time';
import { TimeConfig } from 'in-types';

const chartOffset = minutes.toMillis(5);
export const minEventEntityWindowSize = minutes.toMillis(3);

export function getChartTimeConfigByEvent(
  event: EventMap,
  to: number | null = (event.get('state') as string) === 'closed' ? (event.get('end') as number) : null
): TimeConfig {
  const from = event.getIn(['metadata', 'triggeringTime'], (event.get('start') as number) - minutes.toMillis(1));
  const isOpen = event.get('state') === 'open';

  const timeConfig = {
    to,
    focusedMoment: to,
    windowSize: (event.get('end') as number) - from,
    autoRefresh: isOpen
  };

  if (isOpen) {
    timeConfig.windowSize += chartOffset;
  }

  const rollupDuration = getInfraGranularity(timeConfig);
  timeConfig.windowSize = Math.max(rollupDuration * 10, timeConfig.windowSize);

  return timeConfig;
}

export function getTimeConfigFromEvent(event: EventOrMap): TimeConfig {
  const from = getFromOfEvent(event);
  if (from === undefined) {
    throw new Error('Could not derive time config from event.');
  }

  const to = getToOfEvent(event);
  const toForWs = to || Date.now();

  return {
    to,
    focusedMoment: to,
    windowSize: Math.max(minEventEntityWindowSize, toForWs - from),
    autoRefresh: false
  };
}

export function getTimeConfigFromEventForSnapshotRetrieval(event: EventOrMap): TimeConfig {
  const from = getFromOfEvent(event);
  if (from === undefined) {
    throw new Error('Could not derive time config from event.');
  }

  const to = getToOfEvent(event);

  // we use the start-time for the snapshot-retrieval to-timestamp, because the snapshot has to be online
  // at that point in time, but could have been offline already shortly after.
  const startTime = getStartTime(event);
  const toForWs = to || startTime || Date.now();
  // ensure the windowSize is not zero, because this could result in an empty result
  // when loading endpoints
  const windowSize = Math.max(minEventEntityWindowSize, toForWs - from);

  return {
    to: startTime,
    focusedMoment: startTime,
    windowSize,
    autoRefresh: false
  };
}

export function getFromOfEvent(event: EventOrMap): number {
  let from;
  if (typeof event.getIn === 'function') {
    from = event.getIn(['metadata', 'triggeringTime']);
  }
  if (from === undefined && event.metadata && event.metadata.triggeringTime) {
    from = event.metadata.triggeringTime;
  }
  if (from === undefined) {
    from = (typeof event.get === 'function' && event.get('start')) || event.start;
  }
  return from;
}

export function getToOfEvent(event: EventOrMap): number | null {
  return typeof event.get === 'function'
    ? (event.get('state') as string) === 'closed'
      ? (event.get('end') as number)
      : null
    : event.state === 'closed'
    ? event.end
    : null;
}

function getStartTime(event: EventOrMap): number {
  return typeof event.get === 'function' ? (event.get('start') as number) : event.start;
}
