import invariant from 'invariant';

import {getDefaultMetricRollupDuration, getMetricsForTimeframe} from 'in-stores/metric';
import createLineContentRenderer from 'in-charts/Chart/renderer/content/line';
import createDataHolder from 'in-charts/data/dataHolder';
import {getAxisConfig} from 'in-charts/timeFormatting';
import {timeframe$, to$} from 'in-stores/timeline';
import createQueue from 'in-charts/data/queue';
import {offset$} from 'in-stores/timeOffset';
import createScale from 'in-charts/scale';
import {theme} from 'in-services/theme';


const contentRendererCreators = {
  stackedArea: createLineContentRenderer,
  line: createLineContentRenderer,
  bar: createLineContentRenderer,
  point: createLineContentRenderer,
  integral: createLineContentRenderer,
  area: createLineContentRenderer
};


export default function createAxisController(config) {
  let timeframeSpecificSubscriptions = [];
  determineNumberOfSeries();
  determineSeriesColors();
  const scales = config.scales = createScales();
  config.axisContentRenderers = createAxisContentRenderers();
  config.queues = createQueues();
  config.dataHolders = createDataHolders();

  establishSubscriptions();

  return {
    resize,
    dispose
  };


  function resize() {
    scales.x.setRangeFrom(config.bounds.left);
    scales.x.setRangeTo(config.bounds.right);
    scales.bufferX.setRangeFrom(config.bounds.left);
    scales.bufferX.setRangeTo(config.bounds.right);

    scales.y1.setRangeFrom(config.bounds.bottom);
    scales.y1.setRangeTo(config.bounds.top);
    if (scales.y2) {
      scales.y2.setRangeFrom(config.bounds.bottom);
      scales.y2.setRangeTo(config.bounds.top);
    }
  }


  function dispose() {
    disposeTimeframeSpecificSubscriptions();
  }


  function disposeTimeframeSpecificSubscriptions() {
    timeframeSpecificSubscriptions.forEach(s => s.dispose());
    timeframeSpecificSubscriptions = [];
  }


  function determineNumberOfSeries() {
    config.y1.numberOfSeries = getNumberOfDataSeries('y1');
    if (config.y2) {
      config.y2.numberOfSeries = getNumberOfDataSeries('y2');
    }
  }


  function getNumberOfDataSeries(axisName) {
    return config[axisName].labels.length;
  }


  function determineSeriesColors() {
    config.y1.colors = config.y1.labels.map((label, i) => theme.chart.strokeColors[i]);

    if (config.y2) {
      config.y2.colors = config.y2.labels.map((label, i) => theme.chart.strokeColors[i + config.y1.numberOfSeries]);
    }
  }


  function createScales() {
    const result = {};

    result.x = createScale();
    result.bufferX = createScale();
    result.y1 = createScale();

    if (config.y2) {
      result.y2 = createScale();
    }

    return result;
  }


  function establishSubscriptions() {
    const actualTimeframe$ = config.timeframe$ || timeframe$;
    config.subscriptions.push(actualTimeframe$.subscribe(timeframe => {
      clearAllData();
      config.rollup = getDefaultMetricRollupDuration(timeframe) || 1000;
      config.timeframe = timeframe;
      config.xAxisFormattingConfig = getAxisConfig(timeframe.windowSize);
      disposeTimeframeSpecificSubscriptions();
      subscribeToDataSources();
      config.signals.restartRendering$.emit(true);
    }));
    config.subscriptions.push(to$.subscribe(to => config.to = to));
    config.subscriptions.push(offset$.subscribe(serverTimeOffset => config.serverTimeOffset = serverTimeOffset));
  }


  function clearAllData() {
    config.queues.y1.clear();
    config.dataHolders.y1.clear();

    if (config.y2) {
      config.queues.y2.clear();
      config.dataHolders.y2.clear();
    }
  }


  function subscribeToDataSources() {
    subscribeToDataSourcesForAxis('y1');
    if (config.y2) {
      subscribeToDataSourcesForAxis('y2');
    }
  }


  function subscribeToDataSourcesForAxis(axisName) {
    const metrics = config[axisName].metrics;
    const queue = config.queues[axisName];

    /* eslint-disable no-loop-func */
    for (let i = 0, len = metrics.length; i < len; i++) {
      timeframeSpecificSubscriptions.push(
        getMetricsForTimeframe({
          snapshotId: config.snapshotId,
          metric: metrics[i],
          timeframe: config.timeframe
        })
        .subscribe(dataPoints => {
          queue.addDataPoints(i, dataPoints);
        })
      );
    }
    /* eslint-enable no-loop-func */
  }


  function createAxisContentRenderers() {
    const result = {};

    result.y1 = createContentRenderer('y1');
    if (config.y2) {
      result.y2 = createContentRenderer('y2');
    }

    return result;
  }


  function createContentRenderer(axisName) {
    const contentRendererCreator = contentRendererCreators[config[axisName].type];

    if (__DEV__) {
      invariant(contentRendererCreator, `Unknown content renderer ${config[axisName].type}`);
    }

    return contentRendererCreator({config, axisName});
  }


  function createQueues() {
    const result = {};

    result.y1 = createQueueForAxis('y1');
    if (config.y2) {
      result.y2 = createQueueForAxis('y2');
    }

    return result;
  }


  function createQueueForAxis(axisName) {
    return createQueue({
      numberOfSeries: config[axisName].numberOfSeries,
      requireExistenceInAllSeries: config.axisContentRenderers[axisName].requireExistenceInAllSeries
    });
  }


  function createDataHolders() {
    const result = {};

    result.y1 = createDataHolder({
      numberOfSeries: config.y1.numberOfSeries
    });
    if (config.y2) {
      result.y2 = createDataHolder({
        numberOfSeries: config.y2.numberOfSeries
      });
    }

    return result;
  }
}
