/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { NumberFormatter } from '@instana/format-numbers';
import { KeyValue } from '@instana/components';
import { TimeConfig } from '@instana/types';

import { getFormatterType, number, PERCENTAGE_FORMATTER_TYPE } from 'in-services/formatters/number';
import { LineMetricUpdateProps } from 'in-components/SparkChart/LineMetricRenderer';
import MetricValue from 'in-components/tables/ServerTable/components/MetricValue';
import SparkChart, { SparkChartProps } from 'in-components/SparkChart/SparkChart';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import SparkTooltip from 'in-components/SparkChart/components/Tooltip';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import AggregationSymbol from 'in-components/AggregationSymbol';
import { MetricDataSeries } from 'in-components/Chart/types';
import { FormatterFn } from 'in-stores/metric/formatters';
import { getChartGranularity } from 'in-stores/metric';
import { isBlank } from 'in-services/util/string';
import Tooltip from 'in-components/Tooltip';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

import locals from './SparkChart.mless';

interface Props {
  loading?: boolean;
  timeConfig: TimeConfig;
  width?: number;
  height?: number;
  rollup?: number;
  label?: string;
  metrics?: MetricDataSeries;
  percentageMetric?: boolean;
  tooltipFormatter?: NumberFormatter;
  customValueTooltip?: React.ReactNode;
  customChartTooltip?: React.ReactNode;
  aggregation?: string;
  showNullValuesChartOnEmptyMetrics?: boolean;
  hideChartOnEmptyMetrics?: boolean;
  horizontalMetricValue?: React.ReactNode;
  verticalMetricValue?: React.ReactNode;
  strokeColor?: string;
  fillColor?: string;
}

export default function SparkChartReactComponent(props: Props) {
  const {
    loading,
    timeConfig,
    width = 72,
    height = 24,
    horizontalMetricValue,
    rollup = getChartGranularity(timeConfig),
    label,
    customValueTooltip,
    customChartTooltip,
    verticalMetricValue,
    aggregation,
    showNullValuesChartOnEmptyMetrics,
    hideChartOnEmptyMetrics
  } = props;
  let metrics = props.metrics;

  const noMetricsAvailable = metrics == null || metrics.length === 0;
  if (noMetricsAvailable && (showNullValuesChartOnEmptyMetrics || hideChartOnEmptyMetrics)) {
    metrics = hideChartOnEmptyMetrics ? [] : createSyntheticNullValues(timeConfig, rollup);
  }

  let sparkChart;
  if (loading) {
    sparkChart = <LoadingIndicator text="" width={width} height={height} />;
  } else if (
    noMetricsAvailable &&
    !showNullValuesChartOnEmptyMetrics &&
    !hideChartOnEmptyMetrics &&
    horizontalMetricValue == null
  ) {
    sparkChart = <>-</>;
  } else if (noMetricsAvailable && !showNullValuesChartOnEmptyMetrics && !hideChartOnEmptyMetrics) {
    sparkChart = <NoDataAvailable className={locals.noData} width={width} height={height} />;
  } else {
    sparkChart = (
      <SparkChartReactWrapper
        {...props}
        height={height}
        width={width}
        percentageMetric={
          props.percentageMetric ?? getFormatterType(props.tooltipFormatter) === PERCENTAGE_FORMATTER_TYPE
        }
        timeConfig={timeConfig}
        metrics={metrics!}
      />
    );
    if (customChartTooltip) {
      sparkChart = (
        <Tooltip align="bottomMiddle" content={customChartTooltip}>
          <div>{sparkChart}</div>
        </Tooltip>
      );
    }
  }

  if (horizontalMetricValue != null) {
    if (label) {
      const value = aggregation ? (
        <div className={locals.iconValueWrapper}>
          <AggregationSymbol aggregation={aggregation} />
          &nbsp;
          <Tooltip content={customValueTooltip} align={'mousePosition'}>
            <span>
              {isBlank(horizontalMetricValue.toString())
                ? t('in-components:sparkChart.notAvailable')
                : horizontalMetricValue}
            </span>
          </Tooltip>
        </div>
      ) : (
        horizontalMetricValue
      );
      return (
        <div className={locals.withHorizontalMetricValueWrapper}>
          {sparkChart}
          <KeyValue className={locals.keyValue} label={label} customValue={value} accentuated />
        </div>
      );
    }
    return (
      <div className={locals.withHorizontalMetricValueWrapper}>
        {sparkChart}
        <MetricValue className={locals.horizontalMetricValue} value={horizontalMetricValue} />
      </div>
    );
  }

  if (verticalMetricValue) {
    return (
      <div className={locals.withVerticalMetricValueWrapper}>
        <MetricValue className={locals.verticalMetricValue} value={verticalMetricValue} />
        {sparkChart}
      </div>
    );
  }

  return sparkChart;
}

interface SparkChartReactWrapperProps extends SparkChartProps, LineMetricUpdateProps {
  tooltipFormatter?: FormatterFn;
  aggregation?: string;
  metrics: MetricDataSeries;
}

class SparkChartReactWrapper extends React.Component<SparkChartReactWrapperProps> {
  static displayName = 'SparkChart';
  sparkChart?: SparkChart | Nullish;
  canvas?: HTMLCanvasElement | Nullish;

  componentDidMount() {
    this.sparkChart = new SparkChart(this.canvas!, this.props);
    this.sparkChart.update(this.props);
  }

  componentDidUpdate() {
    this.sparkChart?.update(this.props);
  }

  componentWillUnmount() {
    if (this.sparkChart) {
      this.sparkChart.dispose();
      this.sparkChart = null;
    }
  }

  render() {
    const { metrics, tooltipFormatter = number.detailed, timeConfig, width } = this.props;

    return (
      <div className={locals.sparkChart}>
        <SparkTooltip metrics={metrics} timeConfig={timeConfig} tooltipFormatter={tooltipFormatter} width={width} />
        <canvas
          className={locals.canvas}
          ref={canvas => {
            this.canvas = canvas;
          }}
        />
      </div>
    );
  }
}

function createSyntheticNullValues(timeConfig: TimeConfig, rollup: number): MetricDataSeries {
  const syntheticMetrics: MetricDataSeries = [];
  const from = (timeConfig.to ?? 0) - timeConfig.windowSize;
  const numDataPoints = timeConfig.windowSize / rollup;
  for (let i = 0; i < numDataPoints; i++) {
    syntheticMetrics[i] = [from + rollup * i, 0];
  }

  return syntheticMetrics;
}
