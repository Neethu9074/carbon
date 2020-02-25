import { defaultProps } from 'recompose';
import React from 'react';

import MetricValue from 'in-components/tables/ServerTable/components/MetricValue';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import SparkTooltip from 'in-components/SparkChart/components/Tooltip';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import KeyValue, { themes } from 'in-new-components/lists/KeyValue';
import SparkChart from 'in-components/SparkChart/SparkChart';
import { number } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import locals from './SparkChart.mless';

export default defaultProps({
  height: 24,
  width: 72
})(SparkChartReactComponent);
function SparkChartReactComponent(props) {
  const {
    loading,
    timeConfig,
    metrics,
    width,
    height,
    horizontalMetricValue,
    label,
    customValueTooltip,
    verticalMetricValue,
    aggregation
  } = props;

  let sparkChart;
  if (loading) {
    sparkChart = <InfiniteCircle width={width} height={height} />;
  } else if (metrics == null || metrics.length === 0) {
    sparkChart = <NoDataAvailable width={width} height={height} />;
  } else {
    sparkChart = <SparkChartReactWrapper {...props} timeConfig={timeConfig} />;
  }

  if (horizontalMetricValue) {
    if (label) {
      const value = aggregation ? (
        <div className={locals.iconValueWrapper}>
          <SvgIcon className={locals.aggregationIcon} type={aggregation === 'SUM' ? 'lib_sum' : 'lib_mean'} size="xs" />
          {horizontalMetricValue}
        </div>
      ) : (
        horizontalMetricValue
      );
      return (
        <div className={locals.withHorizontalMetricValueWrapper}>
          {sparkChart}
          <Tooltip content={customValueTooltip}>
            <KeyValue className={locals.keyValue} label={label} customValue={value} accentuated theme={themes.blue} />
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
