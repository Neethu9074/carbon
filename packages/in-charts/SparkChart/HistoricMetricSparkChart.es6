import shallowEquals from 'fbjs/lib/shallowEqual';
import React from 'react';

import { getMetricsForTimeframe, getPixelAwareRollupSize } from 'in-stores/metric';
import { getBlockSizeMillis } from 'in-services/util/dynamicAggregation';
import SparkChart from 'in-charts/SparkChart/SparkChartReactComponent';
import { getChartWiggleRoom } from 'in-sdk/snapshot';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { createLogger } from 'instalog';

const logger = createLogger('in-charts.SparkChart');

export default connectTo(
  props => {
    return {
      wiggleRoom: getSnapshot(props.snapshotId)
        .map(snapshot => getChartWiggleRoom(snapshot.get('plugin')))
        .distinct()
        .startWith(5000)
    };
  },
  class extends React.Component {
    static displayName = 'HistoricMetricSparkChart';

    static defaultProps = {
      height: 30,
      width: 100
    };

    state = {
      datasource: null
    };

    componentWillMount() {
      this.updateDatasource(this.props);
    }

    componentWillReceiveProps(nextProps) {
      if (!shallowEquals(this.props, nextProps)) {
        this.updateDatasource(nextProps);
      }
    }

    updateDatasource = props => {
      props = Object.create(props);
      props.rollup = getPixelAwareRollupSize(props.timeframe, props.width);

      if (props.aggregation) {
        props.blockSizeMillis = getBlockSizeMillis({
          windowSize: props.timeframe.windowSize,
          maxDataPoints: 100,
          minPixelsPerBlock: 10,
          width: props.width,
          rollup: props.rollup
        });
        props.rollup = props.blockSizeMillis;
        props.isDynamicAggregated = true;
        props.metricBaseMillis = 1000;
      } else if (__DEV__) {
        logger.warn('No aggregation defined for spark chart', props);
      }

      this.setState({
        datasource: getMetricsForTimeframe(props),
        rollup: props.rollup
      });
    };

    render() {
      return <SparkChart {...this.props} datasource={this.state.datasource} rollup={this.state.rollup} />;
    }
  }
);
