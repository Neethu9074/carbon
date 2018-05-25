import { getDefaultMetricRollupDuration } from 'in-stores/metric';

const chartOffset = 5 * 60 * 1000; // 5 min

export function getChartTimeframeByEvent({
  event,
  from = event.getIn(['metadata', 'triggeringTime'], event.get('start') - 1000 * 60),
  to = event.get('state') === 'closed' ? event.get('end') : null
}) {
  const timeConfig = {
    to,
    focusedMoment: to,
    windowSize: event.get('end') - from,
    autoRefresh: false
  };

  if (event.get('state') === 'open') {
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

  const to =
    typeof event.get === 'function'
      ? event.get('state') === 'closed' ? event.get('end') : null
      : event.state === 'closed' ? event.end : null;

  const toForWs = to || Date.now();
  return {
    to,
    focusedMoment: to,
    windowSize: toForWs - from,
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
