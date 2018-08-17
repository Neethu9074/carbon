import { defaultProps } from 'recompose';
import React from 'react';

import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
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
  if (!timeConfig || !metrics || metrics.length === 0) {
    return (
      <div
        style={{
          width: props.width,
          height: props.height
        }}
      >
        <NoDataAvailable size="small" />
      </div>
    );
  }
  return <SparkChartReactWrapper {...props} timeConfig={timeConfig} />;
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
