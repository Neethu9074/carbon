import shallowEquals from 'fbjs/lib/shallowEqual';
import React from 'react';

import SparkChart from 'in-charts/SparkChart/SparkChartReactComponent';
import {getHistoricMetricsWithLiveUpdates} from 'in-stores/metric';
import * as timelineStore from 'in-stores/timeline';

const rpt = React.PropTypes;

export default React.createClass({
  displayName: 'HistoricMetricSparkChart',

  propTypes: {
    width: rpt.number.isRequired,
    height: rpt.number.isRequired,
    timeframe: timelineStore.timeframeShape.isRequired,
    className: rpt.string,

    snapshotId: rpt.string.isRequired,
    metric: rpt.string.isRequired,
    rollup: rpt.number,
    aggregation: rpt.string
  },

  getInitialState() {
    return {
      datasource: null
    };
  },

  componentWillMount() {
    this.updateDatasource(this.props);
  },

  componentWillReceiveProps(nextProps) {
    if (!shallowEquals(this.props, nextProps)) {
      this.updateDatasource(nextProps);
    }
  },

  updateDatasource(props) {
    this.setState({
      datasource: getHistoricMetricsWithLiveUpdates(props)
    });
  },

  render() {
    return (
      <SparkChart {...this.props}
                  datasource={this.state.datasource} />
    );
  }
});
