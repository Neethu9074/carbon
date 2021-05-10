/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import shallowEquals from 'fbjs/lib/shallowEqual';
import React from 'react';

import { createLogger } from '@instana/logger';

import { getMetricsForTimeframe, getPixelAwareRollupSize } from 'in-stores/metric';
import { getBlockSizeMillis } from 'in-services/util/dynamicAggregation';
import { getChartWiggleRoom } from 'in-sdk/snapshot';
import { timeConfig$ } from 'in-stores/time/config';
import { deepCopy } from 'in-services/util/object';
import { serverTime$ } from 'in-stores/serverTime';
import { always } from 'in-services/fixedStreams';
import SparkChart from 'in-components/SparkChart';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const logger = createLogger('in-components/SparkChart/HistoricMetricSparkChart');

export default connectTo(
  props => {
    return {
      timeConfig: props.timeConfig ? null : timeConfig$,
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

    UNSAFE_componentWillMount() {
      this.updateDatasource(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      if (!shallowEquals(this.props, nextProps)) {
        this.updateDatasource(nextProps);
      }
    }

    updateDatasource = props => {
      props = deepCopy(props);
      props.rollup = getPixelAwareRollupSize(props.timeConfig, props.width);

      if (props.aggregation) {
        props.blockSizeMillis = getBlockSizeMillis({
          windowSize: props.timeConfig.windowSize,
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
      return <SparkChartWrapper {...this.props} datasource={this.state.datasource} rollup={this.state.rollup} />;
    }
  }
);

const SparkChartWrapper = connectTo(
  props => {
    if (props.timeConfig.to) {
      return {
        metrics: props.datasource,
        timeConfig: always({
          windowSize: props.timeConfig.windowSize + props.wiggleRoom,
          to: props.timeConfig.to,
          focusedMoment: props.timeConfig.focusedMoment,
          autoRefresh: false
        })
      };
    }

    return {
      metrics: props.datasource,
      timeConfig: serverTime$.map(serverTime => ({
        windowSize: props.timeConfig.windowSize + props.wiggleRoom,
        to: serverTime - props.wiggleRoom,
        focusedMoment: serverTime - props.wiggleRoom,
        autoRefresh: props.timeConfig.autoRefresh
      }))
    };
  },
  function(props) {
    return <SparkChart {...props} />;
  }
);
