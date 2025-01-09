/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import invariant from 'invariant';
import { pick } from 'lodash';
import React from 'react';

import { AxisConfiguration, ChartConfig, MetricMap, TimeShift } from 'in-components/Chart/types';
import ResultAwareChart, { ResultAwareChartConfig } from 'in-components/Chart/ResultAwareChart';
import { translateOffsetToTimeShiftConfig } from 'in-stores/time/shifting';
import { MetricData } from 'in-custom-dashboards/widgets/Chart/types';
import { getResolvedTimeConfig } from 'in-applications/metrics';
import { getChartGranularity } from 'in-stores/metric/metric';
import { deepCopy } from 'in-services/util/object';
import { Result, TimeConfig } from 'in-types';
import { t } from 'in-i18n';

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

interface Props extends ResultAwareChartConfig {
  result: Result<MetricData>;
  companionResult?: Result<MetricData>;
  onLegendItemToggle?: (chartConfig: ChartConfig, label: string) => void;
}

export default function ChartWrapper({ result, companionResult, ...props }: Props): React.ReactElement {
  return <ResultAwareChart result={result} config={wrapProps(result, props, companionResult)} {...props} />;
}

function wrapProps(
  result: Result<MetricData>,
  props: ResultAwareChartConfig,
  companionResult?: Result<MetricData>
): ResultAwareChartConfig {
  const metricsConfiguration = props.metricsConfiguration;
  if (__DEV__ && metricsConfiguration) {
    props.y1?.metricIds.forEach(id => {
      invariant(
        Object.keys(metricsConfiguration.metrics).indexOf(id) !== -1,
        t('in-components:chart.chartWrapperMetricNotfound', { metricId: id })
      );
    });

    props.y2?.metricIds.forEach(id => {
      invariant(
        Object.keys(metricsConfiguration.metrics).indexOf(id) !== -1,
        t('in-components:chart.chartWrapperMetricNotfound', { metricId: id })
      );
    });

    const keys = metricsConfiguration.metrics;
    /// todo: check if this is actually needed
    // @ts-expect-error
    for (let i = 1; i < keys.length; i++) {
      // @ts-expect-error
      if (this[i] !== this[0]) {
        invariant(false, t('in-components:chart.chartWrapperSameAxisSameValue'));
        break;
      }
    }
  }

  if (result.errors.length > 0 || result.progress.loading) {
    return {
      title: props.title,
      cardUseMaxAvailableHeight: props.cardUseMaxAvailableHeight,
      customHeight: props.customHeight,
      rightHeaderContent: props.rightHeaderContent,
      renderErrorDetail: props.renderErrorDetail,
      timeConfig: props.timeConfig,
      customChartSkeletonHeight: props.customChartSkeletonHeight
    };
  }

  const propsClone: Pick<ResultAwareChartConfig, 'y1' | 'y2' | 'originalTimeConfig' | 'timeConfig' | 'granularity'> =
    deepCopy({
      ...pick(props, ['y1', 'y2', 'originalTimeConfig', 'timeConfig', 'granularity'])
    });

  if (propsClone.y1 != null) {
    propsClone.y1.metrics = propsClone.y1.metricIds.map(id => result.data?.[id] || []);
    propsClone.y1.aggregations = propsClone.y1.metricIds.map(id => props.metricsConfiguration?.metrics[id].aggregation);
    determineTimeShifts(propsClone.y1, propsClone.timeConfig, props.metricsConfiguration?.metrics);
    propsClone.y1.companionMetrics = propsClone.y1.companionMetricIds?.map(id => companionResult?.data?.[id] || []);
  }

  if (propsClone.y2 != null) {
    propsClone.y2.metrics = propsClone.y2.metricIds.map(id => result.data?.[id] || []);
    propsClone.y2.aggregations = propsClone.y2.metricIds.map(id => props.metricsConfiguration?.metrics[id].aggregation);
    determineTimeShifts(propsClone.y2, propsClone.timeConfig, props.metricsConfiguration?.metrics);
    propsClone.y2.companionMetrics = propsClone.y2.companionMetricIds?.map(id => companionResult?.data?.[id] || []);
  }

  // result.time depends on the time configuration send to the backend. We use it to fixate the
  // time config for the chart. We never want to show a time axis that is time shifting aware.
  // This change ensures that the axis always represents the current time window.
  const smallestTimeShift = getSmallestTimeShift(propsClone.y1, propsClone.y2);
  propsClone.originalTimeConfig = propsClone.timeConfig;
  propsClone.timeConfig = result.time
    ? getResolvedTimeConfig(propsClone.timeConfig, result.time - smallestTimeShift)
    : propsClone.timeConfig;
  propsClone.granularity = propsClone.granularity || getChartGranularity(propsClone.timeConfig);

  return { ...props, ...propsClone };
}

function determineTimeShifts(axis: AxisConfiguration, timeConfig: TimeConfig, metrics?: MetricMap) {
  let hasTimeShifts = false;

  axis.timeShifts = axis.metricIds.map(id => {
    const timeShift = translateOffsetToTimeShiftConfig(metrics?.[id].timeShift ?? 0, timeConfig);
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
function getSmallestTimeShift(y1?: AxisConfiguration, y2?: AxisConfiguration): number {
  if (!y1 || !y1?.timeShifts) {
    return 0;
  }
  let smallestTimeShift = y1.timeShifts.reduce(getSmallestTimeShiftReducer, Number.MIN_SAFE_INTEGER);

  if (!y2 || !y2.timeShifts) {
    return smallestTimeShift;
  }
  return y2.timeShifts.reduce(getSmallestTimeShiftReducer, smallestTimeShift);
}

function getSmallestTimeShiftReducer(agg: number, timeShift: TimeShift): number {
  if (timeShift == null) {
    return agg;
  } else if (agg == null) {
    return timeShift.offset;
  }
  return Math.max(timeShift.offset, agg);
}
