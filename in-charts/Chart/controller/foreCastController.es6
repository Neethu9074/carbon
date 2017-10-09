import { updateCanvasDimensions } from 'in-charts/canvas';
import { getMetricsForTimeframe } from 'in-stores/metric';
import createDataHolder from 'in-charts/data/dataHolder';
import createQueue from 'in-charts/data/queue';

export default function createForecastController(config) {
  let timeframeSpecificSubscriptions = [];
  let isForecastDefined = false;

  determineForecasts();

  // if there are no forecasts defined for this chart
  if (!isForecastDefined) {
    return {
      dispose: () => {},
      resize: () => {}
    };
  }

  const anomaliesMaskCanvas = document.createElement('canvas');
  const anomaliesMaskCanvasContext = anomaliesMaskCanvas.getContext('2d');

  config.forecastConfig = {
    anomaliesMaskCanvas: anomaliesMaskCanvas,
    anomaliesMaskCanvasContext: anomaliesMaskCanvasContext
  };

  establishSubscriptions();
  return {
    dispose,
    resize
  };

  function determineForecasts() {
    function checkAxis(axisName) {
      const axis = config[axisName];
      if (!axis || !axis.enableForecast) {
        return;
      }
      isForecastDefined = true;

      for (let i = 0, length = axis.metrics.length; i < length; i++) {
        const metric = axis.metrics[i];
        axis.forecastConfig = {
          metrics: []
        };

        const sensitivity = axis.forecastSensitivity || '99';
        const lowMetric = metric + '.forecast.low.' + sensitivity;
        const highMetric = metric + '.forecast.high.' + sensitivity;
        axis.forecastConfig.metrics.push({
          indexInMetrics: i,
          metric,
          lowMetric,
          highMetric
        });
      }

      if (!axis.forecastConfig) {
        return;
      }

      const numberOfSeries = axis.forecastConfig.metrics.length * 2;
      axis.forecastConfig.queue = createQueue({
        numberOfSeries,
        requireExistenceInAllSeries: true
      });

      axis.forecastConfig.dataHolder = createDataHolder({
        numberOfSeries
      });
    }

    checkAxis('y1');
    checkAxis('y2');
  }

  function establishSubscriptions() {
    config.subscriptions.push(
      config.signals.refreshDataSources$.subscribe(() => {
        clearData();
        disposeTimeframeSpecificSubscriptions();
        subscribeToDataSources();
        config.signals.restartRendering$.emit(true);
      })
    );
  }

  function clearData() {
    if (config.y1.forecastConfig) {
      config.y1.forecastConfig.queue.clear();
      config.y1.forecastConfig.dataHolder.clear();
    }
    if (config.y2 && config.y2.forecastConfig) {
      config.y2.forecastConfig.queue.clear();
      config.y2.forecastConfig.dataHolder.clear();
    }
  }

  function subscribeToDataSources() {
    subscribeToForecastDataSourcesForAxis('y1');
    if (config.y2) {
      subscribeToForecastDataSourcesForAxis('y2');
    }
  }

  function subscribeToForecastDataSourcesForAxis(axisName) {
    const axis = config[axisName];
    const forecastConfig = axis.forecastConfig;
    if (!forecastConfig) {
      return;
    }
    const snapshotId = config.snapshotId;

    let queueIndex = 0;
    function subscribeToForecastMetric(metricName) {
      const oneHour = 1000 * 60 * 60;
      let from = config.timeframe.to - config.timeframe.windowSize;
      let to = config.timeframe.to;

      // the smallest rollup for forecasts is 1h. In the worst case it can happen that we don't render
      // the forecasts for 59mins to the left and right because we don't fetch the data. Since we want to
      // visualize anomalies, we need enough data to fill the whole chart with forecasts, grap one more datapoint to
      // the left and one more to the right.
      from -= oneHour;
      to += oneHour;

      timeframeSpecificSubscriptions.push(
        getMetricsForTimeframe({
          snapshotId: snapshotId,
          metric: metricName,
          timeframe: {
            windowSize: to - from,
            to
          },
          rollup: oneHour,
          aggregation: axis.aggregation,
          blockSizeMillis: axis.dynamicCalculatedBlockSizeMillis,
          metricBaseMillis: axis.metricBaseMillis
        }).subscribe(onNewDataPoints, null, queueIndex++, forecastConfig.queue)
      );
    }

    for (let i = 0, length = forecastConfig.metrics.length; i < length; i++) {
      const forecastMetric = forecastConfig.metrics[i];
      subscribeToForecastMetric(forecastMetric.lowMetric);
      subscribeToForecastMetric(forecastMetric.highMetric);
    }
  }

  function onNewDataPoints(dataPoints, axisIndex, queue) {
    // data points are not guaranteed to be filled
    if (dataPoints) {
      queue.addDataPoints(axisIndex, dataPoints);
    }
  }

  function disposeTimeframeSpecificSubscriptions() {
    timeframeSpecificSubscriptions.forEach(s => s.dispose());
    timeframeSpecificSubscriptions = [];
  }

  function dispose() {
    disposeTimeframeSpecificSubscriptions();
  }

  function resize() {
    const width = (config.width = config.dom.wrapper.clientWidth | 0);
    updateCanvasDimensions(
      anomaliesMaskCanvas,
      anomaliesMaskCanvasContext,
      width,
      config.height,
      config.devicePixelRatio
    );
  }
}
