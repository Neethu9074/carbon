import { defaultProps } from 'recompose';
import React from 'react';

import MetricValue from 'in-components/tables/ServerTable/components/MetricValue';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import SparkTooltip from 'in-components/SparkChart/components/Tooltip';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import SparkChart from 'in-components/SparkChart/SparkChart';
import { number } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';

import locals from './SparkChart.mless';

export default defaultProps({
  height: 24,
  width: 72
})(SparkChartReactComponent);
function SparkChartReactComponent(props) {
  const { loading, timeConfig, metrics } = props;

  let sparkChart;
  if (loading) {
    sparkChart = <InfiniteCircle width={props.width} height={props.height} />;
  } else if (metrics == null || metrics.length === 0) {
    sparkChart = <NoDataAvailable width={props.width} height={props.height} />;
  } else {
    sparkChart = <SparkChartReactWrapper {...props} timeConfig={timeConfig} />;
  }

  if (props.horizontalMetricValue) {
    if (props.label) {
      return (
        <div className={locals.withHorizontalMetricValueWrapper}>
          {sparkChart}
          <Tooltip content={props.customValueTooltip}>
            <div className={locals.horizontalLabelAndValueWrapper}>
              <div className={locals.label}>{props.label}</div>
              <MetricValue className={locals.horizontalMetricValue} value={props.horizontalMetricValue} />
            </div>
          </Tooltip>
        </div>
      );
    }
    return (
      <div className={locals.withHorizontalMetricValueWrapper}>
        {sparkChart}
        <MetricValue className={locals.horizontalMetricValue} value={props.horizontalMetricValue} />
      </div>
    );
  }

  if (props.verticalMetricValue) {
    return (
      <div className={locals.withVerticalMetricValueWrapper}>
        <MetricValue className={locals.verticalMetricValue} value={props.verticalMetricValue} />
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

  componentDidUpdate(nextProps) {
    this.sparkChart.update(nextProps);
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
