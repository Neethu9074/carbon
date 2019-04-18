import { create } from 'reactive-observables';
import { isEqual } from 'lodash';
import React from 'react';

import { getBlockSizeMillis, getPredefinedBlockSizeMillisForBlockSize } from 'in-services/util/dynamicAggregation';
import { getMetricsForTimeframe, getDefaultMetricRollupDuration } from 'in-stores/metric';
import getElementDimensions from 'in-hoc/getElementDimensions';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { WIDTH } from 'in-new-components/Axis/VerticalAxis';
import Chart from 'in-components/Chart/ChartReactComponent';
import createDataHolder from 'in-charts/data/dataHolder';
import createQueue from 'in-charts/data/queue';

export default getElementDimensions(
  class InfrastructureMetricChartBehavior extends React.Component {
    static displayName = 'InfrastructureMetricChartBehavior';

    constructor(props) {
      super(props);

      this.subscriptions = [];
      this.queues$ = create();
      this.queues = null;
      this.dataHolders = null;
      this.mapProps(this.props);
      this.createQueuesAndDataHolders();

      this.state = {};
    }

    componentDidMount() {
      this.setupMetricSubscriptions(this.queues);
    }

    shouldComponentUpdate(nextProps, nextState) {
      return !isEqual(this.state, nextState) || !isEqual(this.props, nextProps);
    }

    componentDidUpdate(prevProps) {
      if (!isEqual(this.props, prevProps)) {
        this.disposeMetricSubscriptions();

        this.queues$ = create();

        this.mapProps(this.props);
        this.createQueuesAndDataHolders();

        this.queues$.emit({ queues: this.queues, dataHolders: this.dataHolders });
        this.setupMetricSubscriptions(this.queues);
      }
    }

    componentWillUnmount() {
      this.disposeMetricSubscriptions();
    }

    mapProps = props => {
      let { timeConfig, y1, y2, minRollup } = props;
      this.timeConfig = resolveTimeConfig(timeConfig);
      this.granularity = getDefaultMetricRollupDuration(timeConfig, minRollup).rollup;
      this.y1 = mapAxis(y1);
      this.y2 = mapAxis(y2);
    };

    createQueuesAndDataHolders = () => {
      const queues = {};
      queues.y1 = this.createQueueForAxis('y1');
      queues.y2 = this.createQueueForAxis('y2');

      const dataHolders = {};
      dataHolders.y1 = this.createDataHolderForAxis('y1');
      dataHolders.y2 = this.createDataHolderForAxis('y2');

      this.queues = queues;
      this.dataHolders = dataHolders;
    };

    createQueueForAxis = axisName => {
      const axis = this.props[axisName];
      if (!axis) {
        return null;
      }

      return createQueue({
        numberOfSeries: this[axisName].numberOfSeries,
        requireExistenceInAllSeries: true
      });
    };

    createDataHolderForAxis = axisName => {
      const axis = this.props[axisName];
      if (!axis) {
        return null;
      }

      return createDataHolder({
        numberOfSeries: this[axisName].numberOfSeries
      });
    };

    setupMetricSubscriptions = queues => {
      this.setupMetricSubscriptionsForAxis(this.props.y1, queues.y1);
      this.setupMetricSubscriptionsForAxis(this.props.y2, queues.y2);

      this.subscriptions.push(
        this.queues$.throttle(1000).subscribe(({ queues, dataHolders }) => {
          const y1Metrics = this.getMetricsFromQueue(queues.y1, dataHolders.y1, this.y1);
          const y2Metrics = this.getMetricsFromQueue(queues.y2, dataHolders.y2, this.y2);
          this.setState({ y1Metrics, y2Metrics });
        })
      );
    };

    setupMetricSubscriptionsForAxis = (axis, queue) => {
      if (!axis) {
        return;
      }

      const metrics = axis.metrics;
      const rollup = getDefaultMetricRollupDuration(this.props.timeConfig, this.props.minRollup);

      for (let i = 0, len = metrics.length; i < len; i++) {
        const snapshotId = this.props.snapshotId || this.props.snapshotIds[i];

        const isDynamicAggregated = !!(axis.maxDataPoints || axis.minPixelsPerBlock || axis.aggregation);
        let blockSizeMillis;
        if (isDynamicAggregated) {
          blockSizeMillis = getPredefinedBlockSizeMillisForBlockSize(
            getBlockSizeMillis({
              windowSize: this.props.timeConfig.windowSize,
              maxDataPoints: axis.maxDataPoints,
              minPixelsPerBlock: axis.minPixelsPerBlock || 1,
              width: getChartCanvasWidth(this.props),
              rollup: rollup.rollup
            })
          );
        }

        this.subscriptions.push(
          getMetricsForTimeframe({
            snapshotId,
            metric: metrics[i],
            timeConfig: this.props.timeConfig,
            rollup: rollup.rollup,
            aggregation: axis.aggregation,
            blockSizeMillis: blockSizeMillis,
            metricBaseMillis: axis.metricBaseMillis,
            isDynamicAggregated: isDynamicAggregated
          }).subscribe(this.onNewDataPoints, null, i, queue)
        );
      }
    };

    onNewDataPoints = (dataPoints, axisIndex, queue) => {
      // data points are not guaranteed to be filled
      if (dataPoints) {
        queue.addDataPoints(axisIndex, dataPoints);
        this.queues$.emit({ queues: this.queues, dataHolders: this.dataHolders });
      }
    };

    getMetricsFromQueue = (queue, dataHolder, axis) => {
      if (!axis) {
        return [];
      }

      const newDataColumns = queue.get();
      const from = this.timeConfig.to - this.timeConfig.windowSize;

      dataHolder.insertSorted(newDataColumns);
      dataHolder.expireDataPointsOlderThan(from - this.timeConfig.windowSize * 0.1); // keep 10% of the overall windowsize for a smooth fade out
      const dataColumnsMetrics = dataHolder.getDataColumns();

      const numberOfSeries = axis.numberOfSeries;
      let metrics = [];
      for (let i = 0; i < numberOfSeries; i++) {
        metrics[i] = [];
      }

      // for 1.0, metrics are send like Array[#Columns][dataPoint / metricSerie]
      // for the charts we need Array[#metricSeries][all dataPoints / metricSerie (sorted)]
      for (let i = 0; i < dataColumnsMetrics.length; i++) {
        const series = dataColumnsMetrics[i];
        for (let i2 = 0; i2 < series.length; i2++) {
          metrics[i2][i] = series[i2];
        }
      }

      return metrics;
    };

    disposeMetricSubscriptions = () => {
      this.subscriptions.forEach(s => s.dispose());
      this.subscriptions = [];
    };

    render() {
      let { timeConfig, granularity, y1, y2 } = this;
      const { y1Metrics = [], y2Metrics = [] } = this.state;

      y1.metrics = y1Metrics;
      if (y2) {
        y2.metrics = y2Metrics;
      }

      const ChartComponent = this.props.chartRenderer || Chart;
      return <ChartComponent timeConfig={timeConfig} granularity={granularity} y1={y1} y2={y2} />;
    }
  }
);

function resolveTimeConfig(timeConfig) {
  return {
    ...timeConfig,
    to: timeConfig.to || Date.now()
  };
}

function mapAxis(axis) {
  if (!axis) {
    return undefined;
  }

  return {
    ...axis,
    numberOfSeries: axis.metrics.length,
    min: axis.min || 0,
    renderer: Renderer[axis.type] || Renderer.point
  };
}

function getChartCanvasWidth(props) {
  let wholeChartWidth = props.width || 0;
  const chartWidth = wholeChartWidth - (props.y2 ? 2 : 1) * WIDTH;
  return chartWidth;
}
