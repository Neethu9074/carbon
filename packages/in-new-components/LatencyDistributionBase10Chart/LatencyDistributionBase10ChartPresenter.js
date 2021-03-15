/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create } from '@instana/observables';
import React, { useState } from 'react';

import PercentileMenu, {
  ALL_PERCENTILES
} from 'in-new-components/LatencyDistributionBase10Chart/components/PercentileMenu';
import LatencyChartOverlay from 'in-new-components/LatencyDistributionBase10Chart/components/LatencyChartOverlay';
import PercentileMarkers from 'in-new-components/LatencyDistributionBase10Chart/components/PercentileMarkers';
import HorizontalAxis from 'in-new-components/LatencyDistributionBase10Chart/components/HorizontalAxis';
import LineChart from 'in-new-components/LatencyDistributionBase10Chart/components/LineChart';
import BarChart from 'in-new-components/LatencyDistributionBase10Chart/components/BarChart';
import Tooltip from 'in-new-components/LatencyDistributionBase10Chart/components/Tooltip';
import { HEIGHT as horizontalAxisHeight } from 'in-new-components/Axis/HorizontalAxis';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import VerticalAxis from 'in-new-components/Axis/VerticalAxis';
import Legend from 'in-components/Chart/components/Legend.js';
import { defaultTimeShift } from 'in-stores/time/shifting';
import useObservable from 'in-hooks/useObservable';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './LatencyDistributionBase10ChartPresenter.mless';

const colorLatency = theme.lib.colors.chart.strokeColors100[0];
const colorLatencyTimeShift = theme.lib.colors.timeShift;

export default function LatencyDistributionBase10ChartPresenter({
  height,
  width,
  customWidth,
  customHeight,
  showPercentileMenu,
  showLegend,
  selectionAdjustable,
  subscription,
  timeShiftSubscription,
  selectionMenuItems,
  onSelectionChanged,
  selection,
  dataSource,
  timeShiftConfig = defaultTimeShift
}) {
  // which metrics to hide on the chart
  const filteredDataSeries$ = create();
  const [filteredDataSeries, setFilteredDataSeries] = useState(new Set([]));

  const [percentilesShown, setPercentilesShown] = useState(ALL_PERCENTILES);

  const subscriptionResult = useObservable(subscription, [subscription]);
  const timeShiftSubscriptionResult = useObservable(timeShiftSubscription, [timeShiftSubscription]);

  const timeShiftEnabled = !!timeShiftConfig.offset;

  if (!width || !subscriptionResult || (timeShiftSubscription && !timeShiftSubscriptionResult)) {
    // observable results are not available yet
    return <div style={{ height: customHeight || height }} className={locals.histogram} />;
  }

  const chartWidth = customWidth || width;
  const chartHeight = (customHeight || height) - horizontalAxisHeight;

  if (
    subscriptionResult.errors.length > 0 ||
    (timeShiftSubscription && timeShiftSubscriptionResult.errors.length > 0)
  ) {
    return (
      <div className={locals.container}>
        <NoDataAvailable width={chartWidth} height={chartHeight} />
      </div>
    );
  } else if (
    subscriptionResult.progress.loading ||
    (timeShiftSubscription && timeShiftSubscriptionResult.progress.loading)
  ) {
    // First time progress received, percentage seems to be empty, so start with 0.2 to have a small arc
    return (
      <div className={locals.container}>
        <LoadingIndicator height={chartHeight} size="xxl" />
      </div>
    );
  } else if (
    // all buckets are empty (have 0 calls)
    subscriptionResult.data.buckets.map(b => b.calls).reduce((a, b) => a + b, 0) === 0 &&
    (!timeShiftSubscription ||
      timeShiftSubscriptionResult.data.buckets.map(b => b.calls).reduce((a, b) => a + b, 0) === 0)
  ) {
    return (
      <div className={locals.container}>
        <NoDataAvailable
          width={chartWidth}
          height={chartHeight}
          text={t('in-new-components:latencyDistributionBase10Chart.presenterLabelNoDataToDisplay')}
        />
      </div>
    );
  }

  const toggleDataSeries = name => {
    setFilteredDataSeries(prevFilteredDataSeries => {
      const newFilteredDataSeries = new Set(prevFilteredDataSeries.keys());
      if (newFilteredDataSeries.has(name)) {
        newFilteredDataSeries.delete(name);
      } else {
        newFilteredDataSeries.add(name);
      }
      filteredDataSeries$.emit(newFilteredDataSeries);
      return newFilteredDataSeries;
    });
  };

  const metricName =
    dataSource === 'traces'
      ? t('in-new-components:latencyDistributionBase10Chart.presenterLabelTraces')
      : t('in-new-components:latencyDistributionBase10Chart.presenterLabelCalls');
  const chartConfig = {
    config: {
      y1: {
        labels: [metricName],
        colors100: [colorLatency],
        timeShifts: [{ offset: 0 }],
        reverseOrder: true
      },
      toggleDataSeries: toggleDataSeries,
      filteredDataSeries$: filteredDataSeries$,
      isFiltered: (axis, index) => filteredDataSeries.has(`${axis}-${index}`)
    },
    renderScheduler: {
      forceRender: () => {}
    }
  };
  if (timeShiftEnabled) {
    chartConfig.config.y1.labels.push(metricName);
    chartConfig.config.y1.colors100.push(colorLatencyTimeShift);
    chartConfig.config.y1.timeShifts.push({ offset: timeShiftConfig.offset });
  }
  const enabledMetric = !filteredDataSeries.has('y1-0');
  const enabledTimeShiftMetric = timeShiftEnabled && !filteredDataSeries.has('y1-1');

  // The grouping of data in the buckets are all based on whole numbers. But because of the grouping the to and from become integers.
  // We use Math.ceil to round the numbers to fit the buckets and filters since they also only use whole numbers.
  const data = subscriptionResult.data || { buckets: [] };
  const buckets = data.buckets;
  const timeShiftBuckets = timeShiftSubscriptionResult?.data?.buckets;
  const percentileBuckets = createPercentileBuckets(buckets, data.percentiles);

  // Buckets should be at least 4 pixels wide. At least 1 pixel will be used for a
  // gap between bars.
  const bucketWidth = Math.max(4, chartWidth / buckets.length);
  // Round the bucket center downward to its nearest integer to avoid positioning
  // issues related to decimal pixel values.
  const bucketCenter = Math.floor(bucketWidth / 2);

  // hight of the percentile marker strip which sits directly above the chart
  const percentileStripHeight = Math.floor(0.725 * 16 + 20);
  const maxCallCount = Math.max(
    enabledMetric ? getMaxCallCount(buckets) : 0,
    enabledTimeShiftMetric ? getMaxCallCount(timeShiftBuckets) : 0
  );

  return (
    <>
      <div className={locals.header}>
        {showLegend && <Legend chart={chartConfig} filteredDataSeries={filteredDataSeries} />}
        {showPercentileMenu && (
          <div className={locals.percentileButton}>
            <PercentileMenu
              percentilesShown={percentilesShown}
              onChange={percentiles => setPercentilesShown(percentiles)}
            />
          </div>
        )}
      </div>
      <div className={locals.container} style={{ width: chartWidth }}>
        {// for consistency with other charts hide the vertical axis when no metric is selected
        (enabledMetric || enabledTimeShiftMetric) && (
          <VerticalAxis
            scale={{ from: 0, to: maxCallCount }}
            height={chartHeight - percentileStripHeight}
            style={{
              marginTop: percentileStripHeight,
              backgroundColor: theme.lib.colors.white,
              position: 'absolute',
              zIndex: 1 // z-index__axisLabel from shared
            }}
            tickLabelBackgroundColor={theme.lib.colors.white}
          />
        )}
        <div style={{ height: chartHeight }}>
          <LatencyChartOverlay
            buckets={buckets}
            bucketWidth={bucketWidth}
            bucketCenter={bucketCenter}
            height={chartHeight - percentileStripHeight}
            width={chartWidth}
            selectionMenuItems={selectionMenuItems}
            onSelectionChanged={onSelectionChanged}
            selectionAdjustable={selectionAdjustable}
            selection={selection}
            tooltipRenderer={{
              render: function TooltipRenderer({ from, to, style }) {
                return (
                  <Tooltip
                    metricBuckets={[buckets.slice(from, to), timeShiftBuckets?.slice(from, to)].filter(Boolean)}
                    percentileBuckets={percentileBuckets.slice(from, to)}
                    config={chartConfig.config}
                    style={style}
                  />
                );
              }
            }}
          />
          {timeShiftEnabled ? (
            <LineChart
              metricBuckets={[buckets, timeShiftBuckets].filter(Boolean)}
              config={chartConfig.config}
              bucketWidth={bucketWidth}
              maxCallCount={maxCallCount}
              // 1 pixel less for the horizontal axis
              height={chartHeight - percentileStripHeight - 1}
              width={chartWidth}
              style={{ bottom: 0 }}
            />
          ) : (
            <BarChart
              buckets={buckets}
              config={chartConfig.config}
              bucketWidth={bucketWidth}
              maxCallCount={maxCallCount}
              // 1 pixel less for the horizontal axis
              height={chartHeight - percentileStripHeight - 1}
              style={{ bottom: 0 }}
            />
          )}
          {// percentile markers are based on the normal metric (without time-shift), show it only if enabled
          enabledMetric && (
            <PercentileMarkers
              percentileBuckets={percentileBuckets}
              bucketWidth={bucketWidth}
              bucketCenter={bucketCenter}
              chartHeight={chartHeight}
              percentilesShown={percentilesShown}
            />
          )}
          <HorizontalAxis buckets={buckets} bucketWidth={bucketWidth} bucketCenter={bucketCenter} />
          <HorizontalLines
            nbBars={4}
            height={chartHeight - percentileStripHeight}
            width={bucketWidth * buckets.length}
            style={{ marginTop: percentileStripHeight }}
          />
        </div>
      </div>
    </>
  );
}

function HorizontalLines({ nbBars, height, width, style }) {
  let rows = [];
  for (let i = 0; i < nbBars; i++) {
    rows.push(<div key={i} className={locals.horizontalLine} style={{ height: height / nbBars, width: width }} />);
  }
  return (
    <div className={locals.lines} style={style}>
      {rows}
    </div>
  );
}

function getMaxCallCount(buckets) {
  let max = 0;
  for (let i = 0; i < buckets.length; i++) {
    if (buckets[i].calls > max) {
      max = buckets[i].calls;
    }
  }
  return max;
}

/**
 * Breaks the percentiles object by buckets. The resulting array has the same size as the buckets array,
 * e.g., [
 *         [{percentile: 50, latency: 0}],
 *         [],
 *         [{percentile: 90, latency: 6}, {percentile: 95, latency: 10}],
 *         ...
 *       ]
 *
 * @param {*} buckets - Array of latency distribution buckets [{from: 0, to: 1, tickMark: true, calls: 2033}, ...].
 * @param {*} percentiles - Array of percentiles [{percentile: 50, latency: 0}, {percentile: 90, latency: 6}, {percentile: 95, latency: 10}, {percentile: 99, latency: 122}].
 */
function createPercentileBuckets(buckets, percentiles) {
  return buckets.map(bucket =>
    percentiles.filter(
      percentile =>
        (bucket.from == null || bucket.from <= percentile.latency) &&
        (bucket.to == null || percentile.latency < bucket.to)
    )
  );
}
