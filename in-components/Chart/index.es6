import {isEqual, merge} from 'lodash';
import React from 'react';

import {filterStoreShape} from 'in-components/ChartWithLegend/dataseriesFilterStore';
import {getMetricsForTimeframe} from 'in-stores/metric';
import {timeframeShape} from 'in-stores/timeline';

import Chart from './Chart';


const rpt = React.PropTypes;

/**
 * A small wrapper around in-component's Charts to handle data source creation.
 * Data source creation is to complicated as to implement it in each forge.
 */
const ChartWrapper = React.createClass({

  propTypes: {
    height: rpt.number.isRequired,
    margins: rpt.object,

    timeframe: timeframeShape,

    snapshotId: rpt.string.isRequired,
    y1: rpt.object.isRequired,
    y2: rpt.object,
    filterStore: filterStoreShape.isRequired
  },

  getInitialState() {
    return {
      y1Datasources: null,
      y1Labels: null,
      y2Datasources: null,
      y2Labels: null
    };
  },

  componentDidMount() {
    this.initAxis();
  },

  initAxis() {
    const y1Datasources = this.createDataSources(this.props.y1);
    const y1Labels = this.createMetricBasedLabels(this.props.y1);

    let y2Datasources = null;
    let y2Labels = null;
    if (this.props.y2) {
      y2Datasources = this.createDataSources(this.props.y2);
      y2Labels = this.createMetricBasedLabels(this.props.y2);
    }

    this.setState({
      y1Datasources,
      y1Labels,
      y2Datasources,
      y2Labels
    });
  },

  createDataSources(axis) {
    return axis.metrics.map(metric =>
      getMetricsForTimeframe({
        snapshotId: this.props.snapshotId,
        timeframe: this.props.timeframe,
        metric
      })
    );
  },

  createMetricBasedLabels(axis) {
    let labels = axis.labels;
    if (!labels) {
      labels = axis.metrics.slice();
    }
    return labels;
  },

  componentDidUpdate(prevProps) {
    // isEqual should ignore datasources and labels
    if (this.props.snapshotId !== prevProps.snapshotId ||
        this.props.timeframe.windowSize !== prevProps.timeframe.windowSize ||
        this.props.timeframe.to !== prevProps.timeframe.to ||
        !this.isAxisEqual(this.props.y1, prevProps.y1) ||
        !this.isAxisEqual(this.props.y2, prevProps.y2)) {
      this.initAxis();
    }
  },

  isAxisEqual(y1, y2) {
    if (y1 === y2) {
      return true;
    } else if (y1 !== null && y2 === null) {
      return false;
    } else if (y1 === null && y2 !== null) {
      return false;
    }

    const propsToCheck = ['min', 'max', 'metrics', 'formatter', 'type'];

    for (let i = 0; i < propsToCheck.length; i++) {
      const prop = propsToCheck[i];
      if (!isEqual(y1[prop], y2[prop])) {
        return false;
      }
    }
    return true;
  },

  render() {
    if (this.state.y1Datasources === null) {
      return null;
    }

    const y1 = merge({}, this.props.y1);
    y1.datasources = this.state.y1Datasources;
    y1.labels = this.state.y1Labels;

    let y2;
    if (this.props.y2) {
      y2 = merge({}, this.props.y2);
      y2.datasources = this.state.y2Datasources;
      y2.labels = this.state.y2Labels;
    }

    return (
      <Chart height={this.props.height}
             margins={this.props.margins}
             timeframe={this.props.timeframe}
             y1={y1}
             y2={y2} />
    );
  }
});

export default ChartWrapper;
