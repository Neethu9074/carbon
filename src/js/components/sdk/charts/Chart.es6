'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';
import _ from 'lodash';

import {isIdEqual} from 'instana-ui-services/util/snapshots';
import {create} from 'instana-ui-services/conveyer';
import TimeWindowBasedMetricConveyer from 'instana-ui-services/conveyer/TimeWindowBasedMetricConveyer';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import Chart from 'instana-ui-components/Chart';

const rpt = React.PropTypes;

/**
 * A small wrapper around ui-component's Charts to handle data source creation.
 * Data source creation is to complicated as to implement it in each forge.
 */
const ChartWrapper = React.createClass({
  mixins: [SubscriptionMixin],

  propTypes: {
    type: rpt.string.isRequired,

    width: rpt.number.isRequired,
    height: rpt.number.isRequired,
    margins: rpt.object,

    seriesConfig: rpt.array,
    windowSize: rpt.number.isRequired,
    snapshot: irpt.map.isRequired,
    metrics: rpt.arrayOf(rpt.string).isRequired
  },

  getInitialState() {
    return {
      datasources: null
    };
  },

  componentDidMount() {
    this.createDatasources();
  },

  createDatasources() {
    const datasources = this.props.metrics.map(metric =>
      create(TimeWindowBasedMetricConveyer, {
        snapshot: this.props.snapshot,
        metric,
        timeframe: this.props.windowSize
      })
    );

    this.setState({datasources});
  },

  componentDidUpdate(prevProps) {
    if (!isIdEqual(this.props.snapshot, prevProps.snapshot) ||
        this.props.windowSize !== prevProps.windowSize ||
        !_.isEqual(this.props.metrics, prevProps.metrics)) {
      this.disposeSubscriptions();
      this.createDatasources();
    }
  },

  render() {
    if (this.state.datasources === null ||
        this.state.datasources.length === 0) {
      return null;
    }

    let seriesConfig = this.props.seriesConfig;
    if (!seriesConfig) {
      seriesConfig = this.props.metrics.map(metric => {
        return {label: metric};
      });
    }

    return (
      <Chart type={this.props.type}
             width={this.props.width}
             height={this.props.height}
             margins={this.props.margins}
             seriesConfig={seriesConfig}
             windowSize={this.props.windowSize}
             datasources={this.state.datasources} />
    );
  }
});

export default ChartWrapper;
