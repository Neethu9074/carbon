import shallowEquals from 'fbjs/lib/shallowEqual';
import ReactDOM from 'react-dom';
import React from 'react';

import createSparkChart from 'in-charts/SparkChart/SparkChart';
import * as timelineStore from 'in-stores/timeline';
import {getClassName} from 'in-services/react';


const block = 'in-spark-chart';
const rpt = React.PropTypes;

export default React.createClass({
  displayName: 'SparkChart',

  propTypes: {
    timeframe: timelineStore.timeframeShape.isRequired,
    datasource: rpt.object.isRequired,
    height: rpt.number.isRequired,
    width: rpt.number.isRequired,
    className: rpt.string
  },

  componentDidMount() {
    this.initCharts(this.props);
  },

  componentWillReceiveProps(nextProps) {
    if (!shallowEquals(this.props, nextProps)) {
      this.initCharts(nextProps);
    }
  },

  initCharts(props) {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }

    this.chart = createSparkChart({
      width: props.width,
      height: props.height,
      datasource: props.datasource,
      container: ReactDOM.findDOMNode(this),
      timeframe: props.timeframe
    });
  },

  render() {
    return (
      <div className={getClassName(this, block)} />
    );
  }
});
