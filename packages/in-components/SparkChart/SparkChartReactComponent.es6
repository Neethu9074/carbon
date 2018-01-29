import React from 'react';

import Tooltip from 'in-components/SparkChart/components/Tooltip';
import SparkChart from 'in-components/SparkChart/SparkChart';
import { number } from 'in-services/formatters/number';

import locals from './SparkChart.mless';

export default class extends React.Component {
  static displayName = 'SparkChart';

  componentDidMount() {
    this.sparkChart = new SparkChart(this.canvas);
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
    const { metrics, tooltipFormatter = number.detailed, timeframe } = this.props;
    return (
      <div className={locals.sparkChart}>
        <Tooltip metrics={metrics} timeframe={timeframe} tooltipFormatter={tooltipFormatter} />
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
