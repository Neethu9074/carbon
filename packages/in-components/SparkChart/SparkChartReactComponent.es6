import React from 'react';

import Tooltip from 'in-components/SparkChart/components/Tooltip';
import SparkChart from 'in-components/SparkChart/SparkChart';
import { number } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';

import locals from './SparkChart.mless';

export default function SparkChartReactComponent(props) {
  const timeConfig = props.timeConfig || props.timeframe;
  const { metrics } = props;
  if (!timeConfig || !metrics) {
    return <SvgIcon className={locals.noContentIcon} type="crossed_circle" height={26} color="#bec7cb" />;
  }
  return <SparkChartReactWrapper {...props} timeConfig={timeConfig} />;
}

class SparkChartReactWrapper extends React.Component {
  static displayName = 'SparkChart';

  static defaultProps = {
    height: 30,
    width: 100
  };

  componentDidMount() {
    this.sparkChart = new SparkChart(this.canvas, this.props.width, this.props.height);
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
