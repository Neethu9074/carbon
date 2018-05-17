import { getDefaultMetricRollupDuration } from 'in-stores/metric';

const chartOffset = 5 * 60 * 1000; // 5 min

export function getChartTimeframeByEvent({
  event,
  from = event.getIn(['metadata', 'triggeringTime'], event.get('start') - 1000 * 60),
  to = event.get('state') === 'closed' ? event.get('end') : null
}) {
  const timeframe = {
    to,
    windowSize: event.get('end') - from
  };

  if (event.get('state') === 'open') {
    timeframe.windowSize += chartOffset;
  }

  const rollupDuration = getDefaultMetricRollupDuration(timeframe).rollup;
  timeframe.windowSize = Math.max(rollupDuration * 10, timeframe.windowSize);

  return timeframe;
}

export function getTimeConfigFromEvent(event, fallbackTimeConfig) {
  let from = typeof event.getIn === 'function' && event.getIn(['metadata', 'triggeringTime']);
  if (from == undefined) {
    from = (typeof event.get === 'function' && event.get('start')) || event.start;
  }
  if (from == undefined) {
    if (!fallbackTimeConfig) {
      throw new Error('Could not derive time config from event and no fallback provided.');
    } else {
      from = (fallbackTimeConfig.to || Date.now) - fallbackTimeConfig.windowSize;
    }
  }

  const to =
    typeof event.get === 'function'
      ? event.get('state') === 'closed' ? event.get('end') : null
      : event.state === 'closed' ? event.end : null;

  const toForWs = to || fallbackTimeConfig.to || Date.now();
  return {
    to,
    windowSize: toForWs - from,
    autoRefresh: false
  };
}
