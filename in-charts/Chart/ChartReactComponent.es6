import ReactDOM from 'react-dom';
import {isEqual} from 'lodash';
import React from 'react';

import createChart from 'in-charts/Chart/Chart';

const rpt = React.PropTypes;

export default React.createClass({
  displayName: 'ChartReactComponent',

  propTypes: {
    height: rpt.number.isRequired,
    margins: rpt.object,

    timeframe$: rpt.object,

    snapshotId: rpt.string.isRequired,
    y1: rpt.object.isRequired,
    y2: rpt.object
  },

  componentDidMount() {
    this.renderChart();
  },

  renderChart() {
    const config = Object.create(this.props);
    config.container = ReactDOM.findDOMNode(this);
    this.chart = createChart(config);
  },

  shouldComponentUpdate(nextProps) {
    return this.props.snapshotId !== nextProps.snapshotId ||
        this.props.timeframe$ !== nextProps.timeframe$ ||
        !isEqual(this.props.y1, nextProps.y1) ||
        !isEqual(this.props.y2, nextProps.y2);
  },

  componentDidUpdate() {
    this.dispose();
    this.renderChart();
  },

  componentWillUnmount() {
    this.dispose();
  },

  dispose() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },

  render() {
    return (
      <div />
    );
  }
});
