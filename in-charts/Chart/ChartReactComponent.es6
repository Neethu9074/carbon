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

    snapshotId: rpt.string,
    snapshotIds: rpt.arrayOf(rpt.string),
    y1: rpt.object.isRequired,
    y2: rpt.object,
    activeFilters$: rpt.object
  },

  getDefaultProps() {
    return {
      height: 150
    };
  },

  componentDidMount() {
    this.renderChart();
  },

  renderChart() {
    // Copy all props to separate chart config object from React lifecycle and prop immutability.
    const props = this.props;
    const config = {
      height: props.height,
      margins: props.margins,
      timeframe$: props.timeframe$,
      snapshotId: props.snapshotId,
      snapshotIds: props.snapshotIds,
      y1: props.y1,
      y2: props.y2,
      activeFilters$: props.activeFilters$,
      eventEmitter: this.eventEmitter
    };
    config.container = ReactDOM.findDOMNode(this);
    this.chart = createChart(config);
  },

  shouldComponentUpdate(nextProps) {
    return this.props.snapshotId !== nextProps.snapshotId ||
        !isEqual(this.props.snapshotIds, nextProps.snapshotIds) ||
        this.props.timeframe$ !== nextProps.timeframe$ ||
        !this.isAxisEqual(this.props.y1, nextProps.y1) ||
        !this.isAxisEqual(this.props.y2, nextProps.y2);
  },

  isAxisEqual(currentAxis, nextAxis) {
    if (currentAxis == null && nextAxis == null) {
      return true;
    }
    if (currentAxis != null && nextAxis == null) {
      return false;
    }
    if (currentAxis == null && nextAxis != null) {
      return false;
    }
    return currentAxis.min === nextAxis.min &&
      currentAxis.max === nextAxis.max &&
      currentAxis.formatter === nextAxis.formatter &&
      currentAxis.tooltipFormatter === nextAxis.tooltipFormatter &&
      isEqual(currentAxis.labels, nextAxis.labels) &&
      isEqual(currentAxis.metrics, nextAxis.metrics);
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
