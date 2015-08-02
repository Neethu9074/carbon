'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';
import _ from 'lodash';

import {isIdEqual} from 'in-services/util/snapshots';
import {create} from 'in-services/conveyer';
import TimeWindowBasedMetricConveyer from 'in-services/conveyer/TimeWindowBasedMetricConveyer';
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

    windowSize: rpt.number.isRequired,
    snapshot: irpt.map.isRequired,
    y1: rpt.object.isRequired,
    y2: rpt.object
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
      create(TimeWindowBasedMetricConveyer, {
        snapshot: this.props.snapshot,
        metric,
        timeframe: this.props.windowSize
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
    if (!isIdEqual(this.props.snapshot, prevProps.snapshot) ||
        this.props.windowSize !== prevProps.windowSize ||
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
      if (!_.isEqual(y1[prop], y2[prop])) {
        return false;
      }
    }
    return true;
  },

  render() {
    if (this.state.y1Datasources === null) {
      return null;
    }

    const y1 = _.merge({}, this.props.y1);
    y1.datasources = this.state.y1Datasources;
    y1.labels = this.state.y1Labels;

    let y2;
    if (this.props.y2) {
      y2 = _.merge({}, this.props.y2);
      y2.datasources = this.state.y2Datasources;
      y2.labels = this.state.y2Labels;
    }

    return (
      <Chart height={this.props.height}
             margins={this.props.margins}
             windowSize={this.props.windowSize}
             y1={y1}
             y2={y2} />
    );
  }
});

export default ChartWrapper;
