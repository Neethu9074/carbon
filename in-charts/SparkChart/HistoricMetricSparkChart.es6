import shallowEquals from 'fbjs/lib/shallowEqual';
import React from 'react';

import {getHistoricMetricsWithLiveUpdates, getPixelAwareRollupSize} from 'in-stores/metric';
import SparkChart from 'in-charts/SparkChart/SparkChartReactComponent';
import {timeframeShape} from 'in-stores/timeline';


const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'HistoricMetricSparkChart',

  propTypes: {
    timeframe: timeframeShape.isRequired,
    snapshotId: rpt.string.isRequired,
    metric: rpt.string.isRequired,
    height: rpt.number.isRequired,
    width: rpt.number.isRequired,
    tooltipFormatter: rpt.func,
    aggregation: rpt.string,
    className: rpt.string,
    design: rpt.string,
    rollup: rpt.number
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
    if (props.rollup === undefined) {
      props = Object.create(props);
      props.rollup = getPixelAwareRollupSize(props.timeframe, props.width);
    }
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
