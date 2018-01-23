import React from 'react';

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
    const { metrics, formatter = number } = this.props;
    if (!metrics || metrics.length === 0) {
      return null;
    }

    return (
      <div className={locals.sparkChart}>
        <canvas
          className={locals.canvas}
          ref={canvas => {
            this.canvas = canvas;
          }}
        />
        <span className={locals.number}>{formatter.detailed(metrics[metrics.length - 1][1])}</span>
      </div>
    );
  }
}
