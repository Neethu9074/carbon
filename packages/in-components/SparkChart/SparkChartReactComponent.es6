import React from 'react';

import Tooltip from 'in-components/SparkChart/components/Tooltip';
import SparkChart from 'in-components/SparkChart/SparkChart';
import { number } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';

import locals from './SparkChart.mless';

export default function SparkChartLoadingWrapper(props) {
  const { timeframe, metrics } = props;
  if (!timeframe || !metrics) {
    return <SvgIcon className={locals.noContentIcon} type="crossed_circle" height={26} color="#bec7cb" />;
  }
  return <SparkChartReactWrapper {...props} />;
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
    const { metrics, tooltipFormatter = number.detailed, timeframe, width, height } = this.props;
    return (
      <div className={locals.sparkChart}>
        <Tooltip
          metrics={metrics}
          timeframe={timeframe}
          tooltipFormatter={tooltipFormatter}
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
