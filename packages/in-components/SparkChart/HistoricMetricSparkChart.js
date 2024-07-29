/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect, useRef } from 'react';

import { createLogger } from '@instana/logger';

import { getMetricsForTimeframe, getPixelAwareRollupSize } from 'in-stores/metric';
import { getBlockSizeMillis } from 'in-services/util/dynamicAggregation';
import { shallowEquals } from 'in-services/util/object';
import { getChartWiggleRoom } from 'in-sdk/snapshot';
import { timeConfig$ } from 'in-stores/time/config';
import { deepCopy } from 'in-services/util/object';
import { serverTime$ } from 'in-stores/serverTime';
import { always } from 'in-services/fixedStreams';
import SparkChart from 'in-components/SparkChart';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const logger = createLogger('in-components/SparkChart/HistoricMetricSparkChart');

const HistoricMetricSparkChart = props => {
  const prevProps = useRef(props);
  const [datasource, setDatasource] = useState(null);
  const [rollup, setRollup] = useState(null);

  const updateDatasource = props => {
    props = deepCopy(props);
    props.rollup = getPixelAwareRollupSize(props.timeConfig, props.width);
    if (props.aggregation) {
      props.rollup = getBlockSizeMillis({
        windowSize: props.timeConfig.windowSize,
        maxDataPoints: 100,
        minPixelsPerBlock: 10,
        width: props.width ?? 100,
        rollup: props.rollup
      });
    } else if (__DEV__) {
      logger.warn('No aggregation defined for spark chart', props);
    }
    setDatasource(getMetricsForTimeframe(props));
    setRollup(props.rollup);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    updateDatasource(props);
    // ignore any change to the updateDatasource or prevProps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!shallowEquals(prevProps.current, props)) {
      updateDatasource(props);
    }
    prevProps.current = props;
  }, [props]);

  return (
    <SparkChartWrapper
      {...props}
      height={props.height ?? 30}
      width={props.width ?? 100}
      datasource={datasource}
      rollup={rollup}
    />
  );
};

export default connectTo(({ snapshotId, timeConfig }) => ({
  timeConfig: timeConfig ? null : timeConfig$,
  wiggleRoom: getSnapshot(snapshotId)
    .map(snapshot => getChartWiggleRoom(snapshot.get('plugin')))
    .distinct()
    .startWith(5000)
}))(HistoricMetricSparkChart);

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
  function (props) {
    return <SparkChart {...props} />;
  }
);
