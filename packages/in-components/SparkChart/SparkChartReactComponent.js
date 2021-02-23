/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { defaultProps } from 'recompose';
import React from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import MetricValue from 'in-components/tables/ServerTable/components/MetricValue';
import { number, isPercentageFormatter } from 'in-services/formatters/number';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import SparkTooltip from 'in-components/SparkChart/components/Tooltip';
import SparkChart from 'in-components/SparkChart/SparkChart';
import KeyValue from 'in-new-components/lists/KeyValue';
import { isBlank } from 'in-services/util/string';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import { t } from 'in-i18n';

import locals from './SparkChart.mless';

export default defaultProps({
  height: 24,
  width: 72
})(SparkChartReactComponent);
function SparkChartReactComponent(props) {
  const {
    loading,
    timeConfig,
    width,
    height,
    horizontalMetricValue,
    rollup,
    label,
    customValueTooltip,
    verticalMetricValue,
    aggregation,
    showNullValuesChartOnEmptyMetrics,
    hideChartOnEmptyMetrics,
    valueTheme
  } = props;
  let metrics = props.metrics;

  const noMetricsAvailable = metrics == null || metrics.length === 0;
  if (noMetricsAvailable && (showNullValuesChartOnEmptyMetrics || hideChartOnEmptyMetrics)) {
    metrics = hideChartOnEmptyMetrics ? [] : createSyntheticNullValues(timeConfig, rollup);
  }

  let sparkChart;
  if (loading) {
    sparkChart = <LoadingIndicator text="" width={width} height={height} />;
  } else if (noMetricsAvailable && !showNullValuesChartOnEmptyMetrics && !hideChartOnEmptyMetrics) {
    sparkChart = <NoDataAvailable className={locals.noData} icon={'lib_bar_chart'} width={width} height={height} />;
  } else {
    sparkChart = (
      <SparkChartReactWrapper
        {...props}
        percentageMetric={props.percentageMetric ?? isPercentageFormatter(props.tooltipFormatter)}
        timeConfig={timeConfig}
        metrics={metrics}
      />
    );
  }

  if (horizontalMetricValue != null) {
    if (label) {
      const value = aggregation ? (
        <div className={locals.iconValueWrapper}>
          <AggregationSymbol aggregation={aggregation} />
          {isBlank(horizontalMetricValue.toString())
            ? t('in-components:sparkChart.notAvailable')
            : horizontalMetricValue}
        </div>
      ) : (
        horizontalMetricValue
      );
      return (
        <div className={locals.withHorizontalMetricValueWrapper}>
          {sparkChart}
          <Tooltip content={customValueTooltip}>
            <KeyValue className={locals.keyValue} label={label} customValue={value} theme={valueTheme} accentuated />
          </Tooltip>
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

const aggregationMapping = {
  MEAN: {
    label: t('in-components:sparkChart.mean'),
    icon: 'lib_mean'
  },
  SUM: {
    label: t('in-components:sparkChart.sum'),
    icon: 'lib_sum'
  },
  DISTINCT_COUNT: {
    label: t('in-components:sparkChart.distinctCount'),
    icon: 'lib_sum'
  }
};

function AggregationSymbol({ aggregation }) {
  if (aggregation.startsWith('P')) {
    return (
      <Tooltip content={aggregation} align="mousePosition">
        <small className={locals.percentile}>
          {aggregation.substring(1)}
          <sup>th</sup>
        </small>
      </Tooltip>
    );
  }
  if (aggregation === 'MEAN' || aggregation === 'SUM' || aggregation === 'DISTINCT_COUNT') {
    return (
      <Tooltip content={aggregationMapping[aggregation].label} align="mousePosition">
        <SvgIcon className={locals.aggregationIcon} type={aggregationMapping[aggregation].icon} size="xxs" />
      </Tooltip>
    );
  }
  return (
    <Tooltip content={aggregation} align="mousePosition">
      <small className={locals.percentile}>{aggregation.toLowerCase()}</small>
    </Tooltip>
  );
}

class SparkChartReactWrapper extends React.Component {
  static displayName = 'SparkChart';

  componentDidMount() {
    this.sparkChart = new SparkChart(this.canvas, this.props);
    this.sparkChart.update(this.props);
  }

  componentDidUpdate() {
    this.sparkChart.update(this.props);
  }

  componentWillUnmount() {
    if (this.sparkChart) {
      this.sparkChart.dispose();
      this.sparkChart = null;
    }
  }

  render() {
    const { metrics, tooltipFormatter = number.detailed, timeConfig, width, height, rollup, aggregation } = this.props;

    return (
      <div className={locals.sparkChart}>
        <SparkTooltip
          metrics={metrics}
          timeConfig={timeConfig}
          tooltipFormatter={tooltipFormatter}
          rollup={rollup}
          aggregation={aggregation}
          width={width}
          height={height}
        />
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

function createSyntheticNullValues(timeConfig, rollup) {
  const syntheticMetrics = [];
  const from = timeConfig.to - timeConfig.windowSize;
  const numDataPoints = timeConfig.windowSize / rollup;
  for (let i = 0; i < numDataPoints; i++) {
    syntheticMetrics[i] = [from + rollup * i, 0];
  }

  return syntheticMetrics;
}
