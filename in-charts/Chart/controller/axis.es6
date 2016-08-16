import {getDefaultMetricRollupDuration} from 'in-stores/metric';
import {getAxisConfig} from 'in-charts/timeFormatting';
import {timeframe$, to$} from 'in-stores/timeline';
import {offset$} from 'in-stores/timeOffset';
import createScale from 'in-charts/scale';


export default function createAxisController(config) {
  const scales = config.scales = createScales();

  establishSubscriptions();

  return {
    resize
  };


  function resize() {
    scales.x.setRangeFrom(config.bounds.left);
    scales.x.setRangeTo(config.bounds.right);
    scales.bufferX.setRangeFrom(config.bounds.left);
    scales.bufferX.setRangeTo(config.bounds.right);
  }


  function createScales() {
    const result = {};

    result.x = createScale();
    result.bufferX = createScale();

    return result;
  }


  function establishSubscriptions() {
    const actualTimeframe$ = config.timeframe$ || timeframe$;
    config.subscriptions.push(actualTimeframe$.subscribe(timeframe => {
      config.rollup = getDefaultMetricRollupDuration(timeframe) || 1000;
      config.timeframe = timeframe;
      config.xAxisFormattingConfig = getAxisConfig(timeframe.windowSize);
      config.signals.restartRendering$.emit(true);
    }));
    config.subscriptions.push(to$.subscribe(to => config.to = to));
    config.subscriptions.push(offset$.subscribe(serverTimeOffset => config.serverTimeOffset = serverTimeOffset));
  }
}
