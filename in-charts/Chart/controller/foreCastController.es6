import createAnomalyRenderer from 'in-charts/Chart/renderer/content/anomalies';
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
      update: () => {},
      dispose: () => {},
      resize: () => {}
    };
  }

  const anomaliesMaskCanvas = document.createElement('canvas');
  const anomaliesMaskCanvasContext = anomaliesMaskCanvas.getContext('2d');

  config.forecastConfig = {
    rollup: {
      rollup: 1000 * 60 * 60,
      label: '1h'
    },
    anomaliesMaskCanvas: anomaliesMaskCanvas,
    anomaliesMaskCanvasContext: anomaliesMaskCanvasContext,
    anomalyRenderer: createAnomalyRenderer(config)
  };

  establishSubscriptions();
  return {
    dispose,
    update,
    resize
  };

  function determineForecasts() {
    function checkAxis(axisName) {
      const axis = config[axisName];
      if (!axis || !axis.enableForecast) {
        return;
      }
      isForecastDefined = true;

      axis.forecastConfig = {
        anomalies: {},
        metrics: []
      };

      const numberOfSeries = axis.metrics.length * 2;
      axis.forecastConfig.queue = createQueue({
        numberOfSeries,
        requireExistenceInAllSeries: true
      });
      axis.forecastConfig.dataHolder = createDataHolder({ numberOfSeries });
    }

    checkAxis('y1');
    checkAxis('y2');
  }

  function establishSubscriptions() {
    config.subscriptions.push(
      config.signals.refreshDataSources$.throttle(500).subscribe(() => {
        clearData();
        disposeTimeframeSpecificSubscriptions();
        subscribeToDataSources();
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
    axis.forecastConfig.metrics = [];
    const snapshotId = config.snapshotId;
    const rollup = config.forecastConfig.rollup.rollup;

    function subscribeToMetric(metricName, queueIndex, queue, callback) {
      timeframeSpecificSubscriptions.push(
        getMetricsForTimeframe({
          snapshotId,
          metric: metricName,
          timeframe: config.timeframe,
          rollup
        }).subscribe(dataPoints => callback(dataPoints, queue, queueIndex))
      );
    }

    for (let i = 0, length = axis.metrics.length; i < length; i++) {
      const metric = axis.metrics[i];

      const sensitivity = axis.forecastSensitivity || '99';
      const lowMetric = metric + '.forecast.low.' + sensitivity;
      const highMetric = metric + '.forecast.high.' + sensitivity;
      const anomalyMetric = metric + '.forecast.anomaly.' + sensitivity;
      axis.forecastConfig.metrics.push({
        indexInMetrics: i,
        metric,
        lowMetric,
        highMetric,
        anomalyMetric
      });
    }

    for (let i = 0, length = forecastConfig.metrics.length; i < length; i++) {
      const forecastMetric = forecastConfig.metrics[i];
      subscribeToMetric(forecastMetric.lowMetric, 0, axis.forecastConfig.queue, addDataPoints);
      subscribeToMetric(forecastMetric.highMetric, 1, axis.forecastConfig.queue, addDataPoints);

      subscribeToMetric(forecastMetric.anomalyMetric, 0, axis.forecastConfig.anomalyQueue, dataPoints => {
        axis.forecastConfig.anomalies = {};
        for (let i = 0, length = dataPoints.length; i < length; i++) {
          const dataPoint = dataPoints[i];
          axis.forecastConfig.anomalies[dataPoint.time] = dataPoint;
          axis.forecastConfig.anomalies[dataPoint.time - rollup] = dataPoint;
          axis.forecastConfig.anomalies[dataPoint.time + rollup] = dataPoint;
        }
      });
    }
  }

  function addDataPoints(dataPoints, queue, queueIndex) {
    // data points are not guaranteed to be filled
    if (dataPoints) {
      queue.addDataPoints(queueIndex, dataPoints);
    }
  }

  function disposeTimeframeSpecificSubscriptions() {
    timeframeSpecificSubscriptions.forEach(s => s.dispose());
    timeframeSpecificSubscriptions = [];
  }

  function dispose() {
    disposeTimeframeSpecificSubscriptions();
  }

  function update(nextProps) {
    if (config.y1 && nextProps.y1 && config.y1.forecastSensitivity !== nextProps.y1.forecastSensitivity) {
      config.y1.forecastSensitivity = nextProps.y1.forecastSensitivity;
    }
    if (config.y2 && nextProps.y2 && config.y2.forecastSensitivity !== nextProps.y2.forecastSensitivity) {
      config.y2.forecastSensitivity = nextProps.y2.forecastSensitivity;
    }
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
