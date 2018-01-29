/* eslint-disable  react/no-unused-prop-types */

import shallowEquals from 'fbjs/lib/shallowEqual';
import rpt from 'prop-types';
import React from 'react';

import createSparkChart from 'in-charts/SparkChart/SparkChart';

const block = 'in-spark-chart';

export default class extends React.Component {
  static displayName = 'SparkChart';

  static propTypes = {
    wiggleRoom: rpt.number.isRequired,
    className: rpt.string,
    design: rpt.string
  };

  componentDidMount() {
    this.initCharts(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!shallowEquals(this.props, nextProps)) {
      this.initCharts(nextProps);
    }
  }

  componentWillUnmount() {
    this.disposeSparkChart();
  }

  initCharts = props => {
    this.disposeSparkChart();

    this.chart = createSparkChart({
      width: 100,
      height: 30,
      datasource: props.datasource,
      container: this.container,
      timeframe: {
        windowSize: props.timeframe.windowSize + props.wiggleRoom,
        to: props.timeframe.to
      },
      tooltipFormatter: props.tooltipFormatter,
      wiggleRoom: props.wiggleRoom
    });
  };

  render() {
    let classes = block;
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }
    return <div ref={container => (this.container = container)} className={classes} />;
  }

  disposeSparkChart = () => {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  };
}
