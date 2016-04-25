import shallowEquals from 'fbjs/lib/shallowEqual';
import ReactDOM from 'react-dom';
import React from 'react';

import createSparkChart from 'in-charts/SparkChart/SparkChart';
import * as timelineStore from 'in-stores/timeline';

const rpt = React.PropTypes;
const block = 'in-spark-chart';

export default React.createClass({
  displayName: 'SparkChart',

  propTypes: {
    width: rpt.number.isRequired,
    height: rpt.number.isRequired,
    datasource: rpt.object.isRequired,
    timeframe: timelineStore.timeframeShape.isRequired,
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
    let classes = block;
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }
    return (
      <div className={classes} />
    );
  }
});
