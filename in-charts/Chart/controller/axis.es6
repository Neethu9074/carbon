import { combineLatest } from 'reactive-observables';
import { create } from 'reactive-observables';
import invariant from 'invariant';

import createDiscreteLineContentRenderer from 'in-charts/Chart/renderer/content/discreteLine';
import createStackedAreaContentRenderer from 'in-charts/Chart/renderer/content/stackedArea';
import { getMetricsForTimeframe, getDefaultMetricRollupDuration } from 'in-stores/metric';
import createIntegralContentRenderer from 'in-charts/Chart/renderer/content/integral';
import createPointContentRenderer from 'in-charts/Chart/renderer/content/point';
import createLineContentRenderer from 'in-charts/Chart/renderer/content/line';
import createAreaContentRenderer from 'in-charts/Chart/renderer/content/area';
import createBarContentRenderer from 'in-charts/Chart/renderer/content/bar';
import createDataHolder from 'in-charts/data/dataHolder';
import { getAxisConfig } from 'in-charts/timeFormatting';
import { timeframe$, to$ } from 'in-stores/timeline';
import { getChartWiggleRoom } from 'in-sdk/snapshot';
import { getSnapshot } from 'in-stores/snapshot';
import createQueue from 'in-charts/data/queue';
import { offset$ } from 'in-stores/timeOffset';
import createScale from 'in-charts/scale';
import theme from 'in-services/theme';

const contentRendererCreators = {
  discreteLine: createDiscreteLineContentRenderer,
  stackedArea: createStackedAreaContentRenderer,
  integral: createIntegralContentRenderer,
  point: createPointContentRenderer,
  line: createLineContentRenderer,
  area: createAreaContentRenderer,
  bar: createBarContentRenderer
};

export default function createAxisController(config) {
  let timeframeSpecificSubscriptions = [];
  const resize$ = create();
  determineNumberOfSeries();
  addDataSeriesTogglingSupport();
  determineSeriesColors();
  // Hard real time is hard. We are always 2-3 seconds behing the current server time in terms
  // of availability of metrics. We are removing x millis from the right border in order to
  // hide this fact from the user.
  config.chartWiggleRoom = 5000;
  const scales = (config.scales = createScales());
  config.axisContentRenderers = createAxisContentRenderers();
  config.queues = createQueues();
  config.dataHolders = createDataHolders();

  if (config['y1'].blockSizeMillis) {
    config['y1'].isDynamicAggregated = true;
  }
  if (config['y2'] && config['y2'].blockSizeMillis) {
    config['y2'].isDynamicAggregated = true;
  }

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

    // reduce by 0.5 to account for line thickness
    scales.y1.setRangeFrom(config.bounds.bottom - 0.5);
    scales.y1.setRangeTo(config.bounds.top);
    if (scales.y2) {
      scales.y2.setRangeFrom(config.bounds.bottom - 0.5);
      scales.y2.setRangeTo(config.bounds.top);
    }

    resize$.emit(config.bounds);
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

  function addDataSeriesTogglingSupport() {
    config.subscriptions.push(config.filterStore.activeFilters$.subscribe(onActiveFiltersChange));
  }

  function onActiveFiltersChange(hiddenSeries) {
    config.hasActiveFilters = Object.keys(hiddenSeries).length > 0;
    config.activeSeries = {};
    config.activeSeries.y1 = getActiveSeries(hiddenSeries, 'y1');
    if (config.y2) {
      config.activeSeries.y2 = getActiveSeries(hiddenSeries, 'y2');
    }
    config.processDataColumnsAgain = true;
    config.signals.restartRendering$.emit(true);
  }

  function getActiveSeries(hiddenSeries, axisName) {
    const activeSeries = {};

    for (let i = 0, len = config[axisName].numberOfSeries; i < len; i++) {
      const label = config[axisName].labels[i];
      activeSeries[i] = hiddenSeries[label] !== true;
    }

    return activeSeries;
  }

  function determineSeriesColors() {
    const colors = theme.chart.strokeColors;

    if (!config.y1.colors) {
      config.y1.colors = config.y1.labels.map((label, i) => colors[i % colors.length]);
    }

    if (config.y2 && !config.y2.colors) {
      config.y2.colors = config.y2.labels.map((label, i) => colors[(i + config.y1.numberOfSeries) % colors.length]);
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
    config.subscriptions.push(
      getSnapshot(config.snapshotId ? config.snapshotId : config.snapshotIds[0])
        .map(snapshot => getChartWiggleRoom(snapshot.get('plugin')))
        .distinct()
        .subscribe(chartWiggleRoom => {
          config.chartWiggleRoom = chartWiggleRoom;
          config.signals.restartRendering$.emit(true);
        })
    );

    const actualTimeframe$ = config.timeframe$ || timeframe$;
    config.subscriptions.push(
      combineLatest([actualTimeframe$, resize$]).subscribe(([timeframe]) => {
        clearData();

        config.rollup = getDefaultMetricRollupDuration(timeframe);
        config.timeframe = timeframe;
        config.xAxisFormattingConfig = getAxisConfig(timeframe.windowSize);

        disposeTimeframeSpecificSubscriptions();

        subscribeToDataSources();

        config.signals.restartRendering$.emit(true);
      })
    );
    config.subscriptions.push(to$.subscribe(to => (config.to = to)));
    config.subscriptions.push(offset$.subscribe(serverTimeOffset => (config.serverTimeOffset = serverTimeOffset)));
  }

  function subscribeToDataSources() {
    subscribeToDataSourcesForAxis('y1');
    if (config.y2) {
      subscribeToDataSourcesForAxis('y2');
    }
  }

  function subscribeToDataSourcesForAxis(axisName) {
    const axis = config[axisName];
    const metrics = axis.metrics;

    const queue = config.queues[axisName];
    for (let i = 0, len = metrics.length; i < len; i++) {
      const snapshotId = config.snapshotId || config.snapshotIds[i];
      timeframeSpecificSubscriptions.push(
        getMetricsForTimeframe({
          snapshotId: snapshotId,
          metric: metrics[i],
          timeframe: config.timeframe,
          rollup: config.rollup.rollup,
          aggregation: axis.aggregation,
          blockSizeMillis: axis.blockSizeMillis,
          metricBaseMillis: axis.metricBaseMillis,
          isDynamicAggregated: axis.isDynamicAggregated
        }).subscribe(onNewDataPoints, null, i, queue)
      );
    }
  }

  function onNewDataPoints(dataPoints, axisIndex, queue) {
    // data points are not guaranteed to be filled
    if (dataPoints) {
      queue.addDataPoints(axisIndex, dataPoints);
    }
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

    return contentRendererCreator({ config, axisName });
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

  function clearData() {
    config.dataHolders.y1.clear();
    config.queues.y1.clear();

    if (config.queues.y2) {
      config.dataHolders.y2.clear();
      config.queues.y2.clear();
    }
  }
}
