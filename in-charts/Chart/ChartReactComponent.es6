import {isEqual} from 'lodash';
import React from 'react';

import {timeframeShape} from 'in-stores/timeline';

const rpt = React.PropTypes;

export default React.createClass({
  displayName: 'ChartReactComponent',

  propTypes: {
    height: rpt.number.isRequired,
    margins: rpt.object,

    timeframe: timeframeShape,

    snapshotId: rpt.string.isRequired,
    y1: rpt.object.isRequired,
    y2: rpt.object
  },

  componentDidMount() {
    this.renderChart();
  },

  renderChart() {
    console.log('Rendering chart');
  },

  shouldComponentUpdate(nextProps) {
    return this.props.snapshotId !== nextProps.snapshotId ||
        this.props.timeframe.windowSize !== nextProps.timeframe.windowSize ||
        this.props.timeframe.to !== nextProps.timeframe.to ||
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
