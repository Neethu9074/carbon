import shallowEquals from 'fbjs/lib/shallowEqual';
import React from 'react';

import SparkChart from 'in-charts/SparkChart/SparkChartReactComponent';
import {getHistoricMetricsWithLiveUpdates} from 'in-stores/metric';
import * as timelineStore from 'in-stores/timeline';


const rpt = React.PropTypes;

export default React.createClass({
  displayName: 'HistoricMetricSparkChart',

  propTypes: {
    timeframe: timelineStore.timeframeShape.isRequired,
    snapshotId: rpt.string.isRequired,
    metric: rpt.string.isRequired,
    height: rpt.number.isRequired,
    width: rpt.number.isRequired,
    aggregation: rpt.string,
    className: rpt.string,
    rollup: rpt.number,
    tooltipFormatter: rpt.func
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
