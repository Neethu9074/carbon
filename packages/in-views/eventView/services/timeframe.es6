import { getDefaultMetricRollupDuration } from 'in-stores/metric';

const chartOffset = 5 * 60 * 1000; // 5 min
const minEventEntityWindowSize = 3 * 60 * 1000; // 3 min

export function getChartTimeframeByEvent({
  event,
  from = event.getIn(['metadata', 'triggeringTime'], event.get('start') - 1000 * 60),
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

export function getTimeConfigFromEventForCharts(event) {
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

export function getTimeConfigFromEventForSnapshotRetrieval(event) {
  const from = getFromOfEvent(event);
  if (from === undefined) {
    throw new Error('Could not derive time config from event.');
  }

  const to = getToOfEvent(event);
  const focusedMoment = getFocusedMomentOfEvent(event);
  const toForWs = to || focusedMoment || Date.now();
  // ensure the windowSize is not zero, because this could result in an empty result
  // when loading endpoints
  const windowSize = Math.max(minEventEntityWindowSize, toForWs - from);

  return {
    to: focusedMoment,
    focusedMoment,
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

function getFocusedMomentOfEvent(event) {
  return typeof event.get === 'function'
    ? event.get('triggeringTime', event.get('start'))
    : event.triggeringTime || event.start;
}
