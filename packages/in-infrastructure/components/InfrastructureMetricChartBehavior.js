/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isEqual, omit } from 'lodash';
import React from 'react';

import { create } from '@instana/observables';

import { getBlockSizeMillis, getPredefinedBlockSizeMillisForBlockSize } from 'in-services/util/dynamicAggregation';
import { timeConfigShiftedForIngestion } from 'in-stores/time/config';
import { getMetricsAndMetadataForTimeframe } from 'in-stores/metric';
import createDataHolder from 'in-components/Chart/data/dataHolder';
import useResizeObserverCustom from 'in-hooks/useResizeObserver';
import Renderer from 'in-components/Chart/renderer/Renderer';
import Chart from 'in-components/Chart/ChartReactComponent';
import createQueue from 'in-components/Chart/data/queue';
import { getInfraGranularity } from 'in-stores/metric';

// we don't need to open subscriptions on the componentDidMount. This is because the getElementDimensions hoc
// needs to calculate the dimensions of the chart first. The hoc will definitely set a state which results in a
// componentDidUpdate call. There we can create subscriptions. Bar charts for instance rely on having a proper width
// defined. Also this reduces the number of unneeded backend subscriptions because of this missing information
// inside the componentDidMount
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
      additionalContextMenuButtons,
      renderPostChartContent,
      originalTimeConfig,
      snapshotId,
      snapshotHostFqdn,
      hasActionlane = false,
      distanceBetweenDatapointsInMillis
    } = props;

    this.timeConfig = timeConfigShiftedForIngestion(timeConfig);
    const defaultGranularity = getInfraGranularity(this.timeConfig, minRollup);
    this.granularity = props.minPixelsPerBlock
      ? getPredefinedBlockSizeMillisForBlockSize(
          getBlockSizeMillis({
            windowSize: timeConfig.windowSize,
            minPixelsPerBlock: props.minPixelsPerBlock,
            width: getChartCanvasWidth(props),
            rollup: defaultGranularity
          })
        )
      : defaultGranularity;
    this.primaryContextMenuAction = primaryContextMenuAction;
    this.additionalContextMenuButtons = additionalContextMenuButtons;
    this.customHeight = customHeight;
    this.renderLegend = renderLegend;
    this.y1 = mapAxis(y1);
    this.y2 = mapAxis(y2);
    this.renderPostChartContent = renderPostChartContent;
    this.originalTimeConfig = originalTimeConfig;
    this.snapshotId = snapshotId;
    this.snapshotHostFqdn = snapshotHostFqdn;
    this.hasActionlane = hasActionlane;
    this.distanceBetweenDatapointsInMillis = distanceBetweenDatapointsInMillis;
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
      this.queues$.throttle(1000).subscribe(({ queues, dataHolders, pollRate }) => {
        const y1Metrics = this.getMetricsFromQueue(queues.y1, dataHolders.y1, this.y1);
        const y2Metrics = this.getMetricsFromQueue(queues.y2, dataHolders.y2, this.y2);
        this.setState({ y1Metrics, y2Metrics, pollRate });
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

      this.subscriptions.push(
        getMetricsAndMetadataForTimeframe({
          snapshotId,
          metric: metrics[i],
          timeConfig: this.timeConfig,
          rollup: this.granularity,
          aggregation: axis.aggregation
        }).subscribe(this.onNewDataPoints, null, i, queue)
      );
    }
  };

  onNewDataPoints = (dataPoints, axisIndex, queue) => {
    // data points are not guaranteed to be filled
    if (dataPoints) {
      let data = dataPoints.data ?? dataPoints;
      let pollRate = dataPoints.pollRate ?? 1;
      queue.addDataPoints(axisIndex, data);
      this.queues$.emit({ queues: this.queues, dataHolders: this.dataHolders, pollRate: pollRate });
    }
  };

  getMetricsFromQueue = (queue, dataHolder, axis) => {
    if (!axis) {
      return [];
    }

    const newDataColumns = queue.get();
    const from = this.timeConfig.to - this.timeConfig.windowSize;

    dataHolder.insertSorted(newDataColumns);
    dataHolder.expireDataPointsOlderThan(from - this.granularity);
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
      granularity,
      additionalContextMenuButtons,
      snapshotId,
      snapshotHostFqdn,
      hasActionlane,
      distanceBetweenDatapointsInMillis
    } = this;
    const { y1Metrics = [], y2Metrics = [], pollRate } = this.state;

    y1.metrics = y1Metrics;
    if (y2) {
      y2.metrics = y2Metrics;
    }

    const ChartComponent = this.props.chartRenderer || Chart;
    return (
      <ChartComponent
        renderLegend={renderLegend}
        snapshotId={snapshotId}
        snapshotHostFqdn={snapshotHostFqdn}
        hasActionlane={hasActionlane}
        timeConfig={timeConfig}
        granularity={granularity}
        y1={y1}
        y2={y2}
        customHeight={customHeight}
        primaryContextMenuAction={primaryContextMenuAction}
        renderPostChartContent={renderPostChartContent}
        originalTimeConfig={originalTimeConfig ?? this.props.timeConfig}
        additionalContextMenuButtons={additionalContextMenuButtons}
        wiggleRoom={10000}
        distanceBetweenDatapointsInMillis={getDistanceBetweenDataPointsInMillis(
          distanceBetweenDatapointsInMillis,
          pollRate
        )}
      />
    );
  }
}

function getDistanceBetweenDataPointsInMillis(distanceBetweenDataPoints, pollRate) {
  if (distanceBetweenDataPoints) {
    return distanceBetweenDataPoints;
  }
  return pollRate ? pollRate * 1000 : undefined;
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
    minPixelsPerBlock: axis.minPixelsPerBlock || 5,
    aggregations: axis.metrics.map(() => axis.aggregation?.toUpperCase() || 'MEAN')
  };
}

function getChartCanvasWidth({ width = 0 }) {
  return width;
}

function isDynamicallyAggregated(axis) {
  return !!(axis?.maxDataPoints || axis?.aggregation);
}

export default function InfrastructureMetricChartBehaviorWrapper(props) {
  const { ref, ...dimensions } = useResizeObserverCustom();
  return (
    <div ref={ref}>
      <InfrastructureMetricChartBehavior {...props} {...dimensions} />
    </div>
  );
}
