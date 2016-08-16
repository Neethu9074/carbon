import invariant from 'invariant';

import createStackedAreaContentRenderer from 'in-charts/Chart/renderer/content/stackedArea';
import {getMetricsForTimeframe, getDefaultMetricRollupDuration} from 'in-stores/metric';
import createLineContentRenderer from 'in-charts/Chart/renderer/content/stackedArea';
import createDataHolder from 'in-charts/data/dataHolder';
import {getAxisConfig} from 'in-charts/timeFormatting';
import {timeframe$, to$} from 'in-stores/timeline';
import {serverTime$} from 'in-stores/serverTime';
import createQueue from 'in-charts/data/queue';
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
    dispose,
    removeOldDataPoints
  };


  function dispose() {
    disposeTimeframeSpecificSubscriptions();
  }


  function disposeTimeframeSpecificSubscriptions() {
    timeframeSpecificSubscriptions.forEach(s => s.dispose());
    timeframeSpecificSubscriptions = [];
  }


  function resize() {
    scales.x.setRangeFrom(config.bounds.left);
    scales.x.setRangeTo(config.bounds.right);

    scales.y1.setRangeFrom(config.bounds.bottom);
    scales.y1.setRangeTo(config.bounds.top);
    if (scales.y2) {
      scales.y2.setRangeFrom(config.bounds.bottom);
      scales.y2.setRangeTo(config.bounds.top);
    }
  }


  function createScales() {
    const result = {};

    result.x = createScale();
    result.y1 = createScale();

    if (config.y2) {
      result.y2 = createScale();
    }

    return result;
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


  function establishSubscriptions() {
    const actualTimeframe$ = config.timeframe$ || timeframe$;
    config.subscriptions.push(actualTimeframe$.subscribe(timeframe => {
      clearAllData();
      config.rollup = getDefaultMetricRollupDuration(timeframe) || 1000;
      config.timeframe = timeframe;
      config.xAxisFormattingConfig = getAxisConfig(timeframe.windowSize);
      disposeTimeframeSpecificSubscriptions();
      subscribeToDataSources();
      config.scheduleRenderingRestart();
    }));
    config.subscriptions.push(to$.subscribe(to => config.to = to));
    config.subscriptions.push(serverTime$.subscribe(serverTime => config.serverTime = serverTime));
  }


  function removeOldDataPoints() {
    // slightly increase the window size to avoid removal of items which are still visibile
    // due to incremental animation
    const oldestAllowed = config.to - config.timeframe.windowSize * 1.1;
    config.dataHolders.y1.expireDataPointsOlderThan(oldestAllowed);
    if (config.dataHolders.y2) {
      config.dataHolders.y1.expireDataPointsOlderThan(oldestAllowed);
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


  function clearAllData() {
    config.queues.y1.clear();
    config.dataHolders.y1.clear();

    if (config.y2) {
      config.queues.y2.clear();
      config.dataHolders.y2.clear();
    }
  }
}
