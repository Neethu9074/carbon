import {getDefaultMetricRollupDuration} from 'in-stores/metric';


const chartOffset = 5 * 60 * 1000; // 5 min

export function getChartTimeframeByEvent({event,
                                          from = event.getIn(['metadata', 'triggeringTime'], event.get('start') - (1000 * 60)),
                                          to = (event.get('state') === 'closed') ? event.get('end') : null}) {
  const timeframe = {
    to,
    windowSize: event.get('end') - from
  };

  if (event.get('state') === 'open') {
    timeframe.windowSize += chartOffset;
  }

  const rollupDuration = getDefaultMetricRollupDuration(timeframe);
  timeframe.windowSize = Math.max(rollupDuration * 10, timeframe.windowSize);

  return timeframe;
}
