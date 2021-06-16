/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isEqual, omit } from 'lodash';
import React from 'react';

import { create } from '@instana/observables';

import { getBlockSizeMillis, getPredefinedBlockSizeMillisForBlockSize } from 'in-services/util/dynamicAggregation';
import { getMetricsForTimeframe, getInfraGranularity } from 'in-stores/metric';
import createDataHolder from 'in-components/Chart/data/dataHolder';
import getElementDimensions from 'in-hoc/getElementDimensions';
import Renderer from 'in-components/Chart/renderer/Renderer';
import Chart from 'in-components/Chart/ChartReactComponent';
import createQueue from 'in-components/Chart/data/queue';

// we don't need to open subscriptions on the componentDidMount. This is because the getElementDimensions hoc
// needs to calculate the dimensions of the chart first. The hoc will definitely set a state which results in a
// componentDidUpdate call. There we can create subscriptions. Bar charts for instance rely on having a proper width
// defined. Also this reduces the number of unneeded backend subscriptions because of this missing information
// inside the componentDidMount
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

    shouldComponentUpdate(nextProps, nextState) {
      return !isEqual(this.state, nextState) || !isEqual(this.props, nextProps);
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.shouldResetData(prevState, prevProps)) {
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

    shouldResetData(prevState, prevProps) {
      //avoid unnecessary chart resetting in live mode when chart width changes by only re-rendering charts with dynamically aggregated axes.
      const widthChangeShouldTriggerRedraw =
        isDynamicallyAggregated(this.props.y1) || isDynamicallyAggregated(this.props.y2);
      const propsChangeShouldTriggerRedraw = widthChangeShouldTriggerRedraw
        ? !isEqual(prevProps, this.props)
        : !isEqual(omit(prevProps, 'width'), omit(this.props, 'width'));
      return propsChangeShouldTriggerRedraw;
    }

    mapProps = props => {
      let {
        timeConfig,
        y1,
        y2,
        customHeight,
        minRollup,
        renderLegend,
        primaryContextMenuAction,
        renderPostChartContent,
        originalTimeConfig
      } = props;
      this.timeConfig = resolveTimeConfig(timeConfig);
      this.granularity = getInfraGranularity(timeConfig, minRollup);
      this.primaryContextMenuAction = primaryContextMenuAction;
      this.customHeight = customHeight;
      this.renderLegend = renderLegend;
      this.y1 = mapAxis(y1);
      this.y2 = mapAxis(y2);
      this.renderPostChartContent = renderPostChartContent;
      this.originalTimeConfig = originalTimeConfig;
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
        requireExistenceInAllSeries: false
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
      this.setupMetricSubscriptionsForAxis(this.y1, queues.y1);
      this.setupMetricSubscriptionsForAxis(this.y2, queues.y2);

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

      for (let i = 0, len = metrics.length; i < len; i++) {
        const snapshotId = axis.snapshotId || this.props.snapshotId || this.props.snapshotIds[i];

        const isDynamicAggregated = isDynamicallyAggregated(axis);
        let blockSizeMillis;
        if (isDynamicAggregated) {
          blockSizeMillis = getPredefinedBlockSizeMillisForBlockSize(
            getBlockSizeMillis({
              windowSize: this.props.timeConfig.windowSize,
              maxDataPoints: axis.maxDataPoints,
              minPixelsPerBlock: axis.minPixelsPerBlock || 1,
              width: getChartCanvasWidth(this.props),
              rollup: this.granularity
            })
          );
        }

        this.subscriptions.push(
          getMetricsForTimeframe({
            snapshotId,
            metric: metrics[i],
            timeConfig: this.props.timeConfig,
            rollup: this.granularity,
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
          if (series[i2]) {
            metrics[i2].push(series[i2]);
          }
        }
      }
      return metrics;
    };

    disposeMetricSubscriptions = () => {
      this.subscriptions.forEach(s => s.dispose());
      this.subscriptions = [];
    };

    render() {
      let {
        customHeight,
        timeConfig,
        y1,
        y2,
        renderLegend,
        primaryContextMenuAction,
        renderPostChartContent,
        originalTimeConfig,
        granularity
      } = this;
      const { y1Metrics = [], y2Metrics = [] } = this.state;

      y1.metrics = y1Metrics;
      if (y2) {
        y2.metrics = y2Metrics;
      }

      const ChartComponent = this.props.chartRenderer || Chart;
      return (
        <ChartComponent
          renderLegend={renderLegend}
          timeConfig={timeConfig}
          granularity={granularity}
          y1={y1}
          y2={y2}
          customHeight={customHeight}
          primaryContextMenuAction={primaryContextMenuAction}
          renderPostChartContent={renderPostChartContent}
          originalTimeConfig={originalTimeConfig ?? this.props.timeConfig}
        />
      );
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
    metricIds: axis.metrics,
    renderer: Renderer[axis.type] || Renderer.point,
    minPixelsPerBlock: axis.minPixelsPerBlock || 5
  };
}

function getChartCanvasWidth({ width = 0 }) {
  return width;
}

function isDynamicallyAggregated(axis) {
  return !!(axis?.maxDataPoints || axis?.aggregation);
}
