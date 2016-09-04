import shallowEquals from 'fbjs/lib/shallowEqual';
import React from 'react';

import {getHistoricMetricsWithLiveUpdates, getPixelAwareRollupSize} from 'in-stores/metric';
import SparkChart from 'in-charts/SparkChart/SparkChartReactComponent';
import {getChartWiggleRoom} from 'in-sdk/snapshot';
import {timeframeShape} from 'in-stores/timeline';
import {getSnapshot} from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';


const rpt = React.PropTypes;

export default connectTo(props => {
  return {
    wiggleRoom: getSnapshot(props.snapshotId)
      .map(snapshot => getChartWiggleRoom(snapshot.get('plugin')))
      .distinct()
      .startWith(5000)
  };
}, React.createClass({

  displayName: 'HistoricMetricSparkChart',

  propTypes: {
    timeframe: timeframeShape.isRequired,
    snapshotId: rpt.string.isRequired,
    wiggleRoom: rpt.number.isRequired,
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
}));
