'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';
import _ from 'lodash';

import {isIdEqual} from 'instana-ui-services/util/snapshots';
import {create} from 'instana-ui-services/conveyer';
import TimeWindowBasedMetricConveyer from 'instana-ui-services/conveyer/TimeWindowBasedMetricConveyer';
import Chart from 'instana-ui-components/Chart';

const rpt = React.PropTypes;

/**
 * A small wrapper around ui-component's Charts to handle data source creation.
 * Data source creation is to complicated as to implement it in each forge.
 */
const ChartWrapper = React.createClass({

  propTypes: {
    width: rpt.number.isRequired,
    height: rpt.number.isRequired,
    margins: rpt.object,

    windowSize: rpt.number.isRequired,
    snapshot: irpt.map.isRequired,
    y1: rpt.object.isRequired,
    y2: rpt.object
  },

  componentDidMount() {
    this.initAxis();
  },

  initAxis() {
    this.createDataSources(this.props.y1);
    this.createDefaultSeriesConfig(this.props.y1);

    if (this.props.y2) {
      this.createDataSources(this.props.y2);
      this.createDefaultSeriesConfig(this.props.y2);
    }

    this.forceUpdate();
  },

  createDataSources(axis) {
    axis.datasources = axis.metrics.map(metric =>
      create(TimeWindowBasedMetricConveyer, {
        snapshot: this.props.snapshot,
        metric,
        timeframe: this.props.windowSize
      })
    );
  },

  createDefaultSeriesConfig(axis) {
    let seriesConfig = axis.seriesConfig;
    if (!seriesConfig) {
      axis.seriesConfig = axis.metrics.map(metric => {
        return {label: metric};
      });
    }
  },

  componentDidUpdate(prevProps) {
    if (!isIdEqual(this.props.snapshot, prevProps.snapshot) ||
        this.props.windowSize !== prevProps.windowSize ||
        !_.isEqual(this.props.y1, prevProps.y1) ||
        !_.isEqual(this.props.y2, prevProps.y2)) {
      this.initAxis();
    }
  },

  render() {
    if (this.props.y1.datasources === undefined) {
      return null;
    }

    return (
      <Chart width={this.props.width}
             height={this.props.height}
             margins={this.props.margins}
             windowSize={this.props.windowSize}
             y1={this.props.y1}
             y2={this.props.y2} />
    );
  }
});

export default ChartWrapper;
