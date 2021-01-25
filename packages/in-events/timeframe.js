/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getDefaultMetricRollupDuration } from 'in-stores/metric';
import { minutes } from 'in-services/time';

const chartOffset = minutes.toMillis(5);
const minEventEntityWindowSize = minutes.toMillis(3);

export function getChartTimeConfigByEvent({
  event,
  from = event.getIn(['metadata', 'triggeringTime'], event.get('start') - minutes.toMillis(1)),
  to = event.get('state') === 'closed' ? event.get('end') : null
}) {
  const isOpen = event.get('state') === 'open';
  const timeConfig = {
    to,
    focusedMoment: to,
    windowSize: event.get('end') - from,
    autoRefresh: isOpen
  };

  if (isOpen) {
    timeConfig.windowSize += chartOffset;
  }

  const rollupDuration = getDefaultMetricRollupDuration(timeConfig).rollup;
  timeConfig.windowSize = Math.max(rollupDuration * 10, timeConfig.windowSize);

  return timeConfig;
}

export function getTimeConfigFromEvent(event) {
  const from = getFromOfEvent(event);
  if (from === undefined) {
    throw new Error('Could not derive time config from event.');
  }

  const to = getToOfEvent(event);
  const toForWs = to || Date.now();

  return {
    to,
    focusedMoment: to,
    windowSize: toForWs - from,
    autoRefresh: false
  };
}

export function getSmartAlertAnalyzeTimeframe(event, alertConfig) {
  if (alertConfig.rule.alertType === 'throughput') {
    return getWidenedTimeConfigFromEvent(event, alertConfig.granularity);
  }
  return getTimeConfigFromEvent(event);
}

/**
 * Get the timeframe from an event and, if possible, widens the timeConfig on both sides, to return a bigger timeframe.
 * This can be useful when it is known that the surrounding area is actually from interest too.
 * @param event                The event to retrieve the timeframe from.
 * @param widenTimeframeMillis The time in millis to extend both sides. If to is NULL, then only the LHS is extended.
 */
function getWidenedTimeConfigFromEvent(event, widenTimeframeMillis) {
  const timeConfig = getTimeConfigFromEvent(event);
  // extend begin by one bucket, and end also by bucket in case the to-timestamp is fixed
  const toIsFixed = !!timeConfig.to;
  const adjustedTo = toIsFixed ? timeConfig.to + widenTimeframeMillis : timeConfig.to;
  return {
    to: adjustedTo,
    focusedMoment: adjustedTo,
    windowSize: timeConfig.windowSize + (toIsFixed ? 2 : 1) * widenTimeframeMillis,
    autoRefresh: timeConfig.autoRefresh
  };
}

export function getTimeConfigFromEventForSnapshotRetrieval(event) {
  const from = getFromOfEvent(event);
  if (from === undefined) {
    throw new Error('Could not derive time config from event.');
  }

  const to = getToOfEvent(event);

  // we use the start-time for the snapshot-retrieval to-timestamp, because the snapshot has to be online
  // at that point in time, but could have been offline already shortly after.
  const triggeringTimeOrStart = getTriggeringTimeOrStart(event);
  const toForWs = to || triggeringTimeOrStart || Date.now();
  // ensure the windowSize is not zero, because this could result in an empty result
  // when loading endpoints
  const windowSize = Math.max(minEventEntityWindowSize, toForWs - from);

  return {
    to: triggeringTimeOrStart,
    focusedMoment: triggeringTimeOrStart,
    windowSize,
    autoRefresh: false
  };
}

function getFromOfEvent(event) {
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

function getToOfEvent(event) {
  return typeof event.get === 'function'
    ? event.get('state') === 'closed'
      ? event.get('end')
      : null
    : event.state === 'closed'
    ? event.end
    : null;
}

function getTriggeringTimeOrStart(event) {
  return typeof event.get === 'function'
    ? event.get('triggeringTime', event.get('start'))
    : event.triggeringTime || event.start;
}
