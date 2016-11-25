import shallowEquals from 'fbjs/lib/shallowEqual';
import ReactDOM from 'react-dom';
import React from 'react';

import createSparkChart from 'in-charts/SparkChart/SparkChart';
import {timeframeShape} from 'in-stores/timeline';


const block = 'in-spark-chart';
const rpt = React.PropTypes;

export default React.createClass({
  displayName: 'SparkChart',

  propTypes: {
    timeframe: timeframeShape.isRequired,
    datasource: rpt.object.isRequired,
    wiggleRoom: rpt.number.isRequired,
    height: rpt.number.isRequired,
    width: rpt.number.isRequired,
    tooltipFormatter: rpt.func,
    className: rpt.string,
    design: rpt.string
  },

  componentDidMount() {
    this.initCharts(this.props);
  },

  componentWillReceiveProps(nextProps) {
    if (!shallowEquals(this.props, nextProps)) {
      this.initCharts(nextProps);
    }
  },

  componentWillUnmount() {
    this.disposeSparkChart();
  },

  initCharts(props) {
    this.disposeSparkChart();

    this.chart = createSparkChart({
      width: props.width,
      height: props.height,
      datasource: props.datasource,
      container: ReactDOM.findDOMNode(this),
      timeframe: props.timeframe,
      tooltipFormatter: props.tooltipFormatter,
      design: this.props.design,
      wiggleRoom: this.props.wiggleRoom
    });
  },

  render() {
    let classes = block;
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }
    return (
      <div className={classes} />
    );
  },

  disposeSparkChart() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  }
});
