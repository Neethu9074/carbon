import { defaultProps } from 'recompose';
import React from 'react';

import MetricValue from 'in-components/tables/ServerTable/components/MetricValue';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import Tooltip from 'in-components/SparkChart/components/Tooltip';
import SparkChart from 'in-components/SparkChart/SparkChart';
import { number } from 'in-services/formatters/number';

import locals from './SparkChart.mless';

export default defaultProps({
  height: 24,
  width: 72
})(SparkChartReactComponent);
function SparkChartReactComponent(props) {
  const timeConfig = props.timeConfig || props.timeConfig;
  const { metrics } = props;

  let sparkChart;
  if (!timeConfig || !metrics) {
    sparkChart = <InfiniteCircle width={props.width} height={props.height} />;
  } else if (metrics.length === 0) {
    sparkChart = <NoDataAvailable width={props.width} height={props.height} />;
  } else {
    sparkChart = <SparkChartReactWrapper {...props} timeConfig={timeConfig} />;
  }

  if (props.horizontalMetricValue) {
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

  componentWillUpdate(nextProps) {
    this.sparkChart.update(nextProps);
  }

  componentWillUnmount() {
    this.sparkChart.dispose();
    this.sparkChart = null;
  }

  render() {
    const { metrics, tooltipFormatter = number.detailed, timeConfig, width, height, rollup, aggregation } = this.props;
    return (
      <div className={locals.sparkChart}>
        <Tooltip
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
