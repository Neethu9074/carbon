/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import invariant from 'invariant';
import React from 'react';

import { getChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { translateOffsetToTimeShiftConfig } from 'in-stores/time/shifting';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { deepCopy } from 'in-services/util/object';

// Sample Usage
/*
<ChartWrapper
            timeConfig={timeConfig}
            y1={{
              renderer: Renderer.countErrorBar,
              labels: ['Calls', 'Errors'],
              metricIds: ['calls', 'errors'],  <-- theses ids will be referenced in the metricsConfiguration down below
              defaultDisabledMetrics: ['errors']
            }}
            y2={{
              renderer: Renderer.line,
              labels: ['Latency'],
              colors: ['#57a7f0'],
              formatter: millis,
              metricIds: ['latency']
            }}
            metricsConfiguration={{
              filter: {
                timeConfig,
                endpointType: data.type,
                endpoint: data.id,
                application: applicationId,
                service: serviceId
              },
              metrics: {
                calls: {
                  metric: 'calls',
                  granularity: 60000,
                  aggregation: 'SUM'
                },
                errors: {
                  metric: 'errors',
                  granularity: 60000,
                  aggregation: 'SUM'
                },
                latency: {
                  metric: 'latency',
                  granularity: 60000,
                  aggregation: 'SUM'
                }
              }
            }}
          />
 */
export default function ChartWrapper({ result, ...props }) {
  return <ResultAwareChart result={result} config={wrapProps(result, props)} />;
}

function wrapProps(result, props) {
  if (__DEV__ && props.metricsConfiguration) {
    props.y1?.metricIds.forEach(id => {
      invariant(Object.keys(props.metricsConfiguration.metrics).indexOf(id) !== -1, `Metric id ${id} not found.`);
    });

    props.y2?.metricIds.forEach(id => {
      invariant(Object.keys(props.metricsConfiguration.metrics).indexOf(id) !== -1, `Metric id ${id} not found.`);
    });

    const keys = props.metricsConfiguration.metrics;
    for (let i = 1; i < keys.length; i++) {
      if (this[i] !== this[0]) {
        invariant(false, 'All aggregation types for one axis must have the same value.');
        break;
      }
    }
  }

  if (result.errors.length > 0 || result.progress.loading) {
    return {
      cardTitle: props.cardTitle,
      cardUseMaxAvailableHeight: props.cardUseMaxAvailableHeight,
      cardHeader: props.cardHeader
    };
  }

  const propsClone = deepCopy({
    ...props,
    // cardHeader can be defined and it could be a React element. Cloning this is a super expensive
    // operation that is getting more and more expensive the more often this is executed.
    // Also, there is no need to clone this React element, as we aren't manipulating it.
    cardHeader: undefined
  });

  if (propsClone.y1 != null) {
    propsClone.y1.metrics = propsClone.y1.metricIds.map(id => result.data[id] || []);
    propsClone.y1.aggregations = propsClone.y1.metricIds.map(id => props.metricsConfiguration.metrics[id].aggregation);
    determineTimeShifts(propsClone.y1, props.metricsConfiguration.metrics, propsClone.timeConfig);
  }

  if (propsClone.y2 != null) {
    propsClone.y2.metrics = propsClone.y2.metricIds.map(id => result.data[id] || []);
    propsClone.y2.aggregations = propsClone.y2.metricIds.map(id => props.metricsConfiguration.metrics[id].aggregation);
    determineTimeShifts(propsClone.y2, props.metricsConfiguration.metrics, propsClone.timeConfig);
  }

  // result.time depends on the time configuration send to the backend. We use it to fixate the
  // time config for the chart. We never want to show a time axis that is time shifting aware.
  // This change ensures that the axis always represents the current time window.
  const smallestTimeShift = getSmallestTimeShift(propsClone.y1, propsClone.y2);
  propsClone.originalTimeConfig = propsClone.timeConfig;
  propsClone.timeConfig = getResolvedTimeConfig(propsClone.timeConfig, result.time - smallestTimeShift);
  propsClone.granularity = propsClone.granularity || getChartGranularity(propsClone.timeConfig);
  propsClone.cardHeader = props.cardHeader;
  propsClone.customChartComponent = props.customChartComponent;

  return propsClone;
}

function determineTimeShifts(axis, metrics, timeConfig) {
  let hasTimeShifts = false;

  axis.timeShifts = axis.metricIds.map(id => {
    const timeShift = translateOffsetToTimeShiftConfig(metrics[id].timeShift, timeConfig);
    if (timeShift.offset < 0 || timeShift.offset > 0) {
      hasTimeShifts = true;
    }
    return timeShift;
  });

  if (!hasTimeShifts) {
    // Remove the timeShifts field. This allows the chart to skip time shift adjustment logic.
    axis.timeShifts = null;
  }
}

// Time shifts are always negative, e.g. last hour is 1000 * 60 * 60 * -1. This in turn
// means that the smallest time shift is the largest number
function getSmallestTimeShift(y1, y2) {
  let smallestTimeShift = undefined;
  if (!y1.timeShifts) {
    return 0;
  }
  smallestTimeShift = y1.timeShifts.reduce(getSmallestTimeShiftReducer, smallestTimeShift);

  if (!y2) {
    return smallestTimeShift;
  } else if (!y2.timeShifts) {
    return 0;
  }
  return y2.timeShifts.reduce(getSmallestTimeShiftReducer, smallestTimeShift);
}

function getSmallestTimeShiftReducer(agg, timeShift) {
  if (timeShift == null) {
    return agg;
  } else if (agg == null) {
    return timeShift.offset;
  }
  return Math.max(timeShift.offset, agg);
}
