import invariant from 'invariant';

import createStackedAreaContentRenderer from 'in-charts/Chart/renderer/content/stackedArea';
import {getDefaultMetricRollupDuration, getMetricsForTimeframe} from 'in-stores/metric';
import createLineContentRenderer from 'in-charts/Chart/renderer/content/stackedArea';
import createDataHolder from 'in-charts/data/dataHolder';
import {getAxisConfig} from 'in-charts/timeFormatting';
import {timeframe$, to$} from 'in-stores/timeline';
import createQueue from 'in-charts/data/queue';
import {offset$} from 'in-stores/timeOffset';
import createScale from 'in-charts/scale';


const contentRendererCreators = {
  stackedArea: createStackedAreaContentRenderer,
  line: createLineContentRenderer
};


export default function createAxisController(config) {
  let timeframeSpecificSubscriptions = [];
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
  }


  function dispose() {
    disposeTimeframeSpecificSubscriptions();
  }


  function disposeTimeframeSpecificSubscriptions() {
    timeframeSpecificSubscriptions.forEach(s => s.dispose());
    timeframeSpecificSubscriptions = [];
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

    return contentRendererCreator(config, axisName);
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
      numberOfSeries: getNumberOfDataSeries(axisName),
      requireExistenceInAllSeries: config.axisContentRenderers[axisName].requireExistenceInAllSeries
    });
  }


  function getNumberOfDataSeries(axisName) {
    return config[axisName].labels.length;
  }


  function createDataHolders() {
    const result = {};

    result.y1 = createDataHolder({
      numberOfSeries: getNumberOfDataSeries('y1')
    });
    if (config.y2) {
      result.y2 = createDataHolder({
        numberOfSeries: getNumberOfDataSeries('y2')
      });
    }

    return result;
  }
}
