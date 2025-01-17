/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useRef, useState } from 'react';

import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { create } from '@instana/observables';
import { Message } from '@instana/components';

import PercentileMenu, {
  ALL_PERCENTILES
} from 'in-components/LatencyDistributionBase10Chart/components/PercentileMenu';
import HistogramChartOverlay from 'in-components/HistogramChart/components/HistogramChartOverlay/HistogramChartOverlay';
import HistogramBarChart from 'in-components/HistogramChart/components/HistogramBarChart/HistogramBarChart';
import PercentileMarkers from 'in-components/LatencyDistributionBase10Chart/components/PercentileMarkers';
import HorizontalAxis from 'in-components/LatencyDistributionBase10Chart/components/HorizontalAxis';
import MultiLineToolTipIcon from 'in-components/MultiLineToolTipIcon/MultiLineToolTipIcon';
import LineChart from 'in-components/LatencyDistributionBase10Chart/components/LineChart';
import Tooltip from 'in-components/LatencyDistributionBase10Chart/components/Tooltip';
import { HEIGHT as horizontalAxisHeight } from 'in-components/Axis/HorizontalAxis';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import ChartLegend from 'in-components/Chart/components/ChartLegend';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { chartColors, timeShift } from 'in-themes/chartColors';
import VerticalAxis from 'in-components/Axis/VerticalAxis';
import { defaultTimeShift } from 'in-stores/time/shifting';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import { noop } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

import locals from 'in-components/LatencyDistributionBase10Chart/LatencyDistributionBase10ChartPresenter.mless';

const colorLatency = chartColors.strokeColors100[0];
const colorLatencyTimeShift = timeShift;

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
  timeShiftConfig = defaultTimeShift,
  title,
  aggregation,
  showHeader,
  fastQueryModeEnabled,
  renderWidgetNotSupportedIndicator,
  chartableDataSeries,
  isGrouped,
  setApproximateData = noop
}) {
  // which metrics to hide on the chart
  const filteredDataSeriesRef = useRef(create());
  const filteredDataSeries$ = filteredDataSeriesRef.current;
  const [filteredDataSeries, setFilteredDataSeries] = useState(new Set([]));

  const [percentilesShown, setPercentilesShown] = useState(ALL_PERCENTILES);
  const [cachedResult, setCachedResult] = useState(pendingResult);

  const subscriptionResult = useObservable(subscription, [subscription]) ?? pendingResult;
  const loading = isLoading(subscriptionResult);

  useEffect(() => {
    if (!isLoading(subscriptionResult)) {
      setCachedResult(subscriptionResult);
    }
  }, [subscriptionResult]);

  const timeShiftSubscriptionResult = useObservable(timeShiftSubscription, [timeShiftSubscription]);

  const hasApproximateData = cachedResult?.resultPrecisionDetails?.resultPrecision === 'PRECISION_APPROXIMATE';
  useEffect(() => {
    setApproximateData(hasApproximateData);
  }, [hasApproximateData, setApproximateData]);

  const timeShiftEnabled = !!timeShiftConfig.offset;

  if (!width || !cachedResult || (timeShiftSubscription && !timeShiftSubscriptionResult)) {
    // observable results are not available yet
    return <div style={{ height: customHeight || height }} className={locals.histogram} />;
  }

  const chartWidth = customWidth || width;
  const chartHeight = (customHeight || height) - horizontalAxisHeight;
  const data = cachedResult.data || { buckets: [] };
  const resultArray = data.groups && data.groups.length != 0 && !loading ? data.groups : data.buckets;
  let bucketArray = [];
  if (isGrouped && !loading) {
    resultArray.map(bcktGrp => {
      bcktGrp.buckets?.map((bucket, index) => {
        bucket = {
          ...bucket,
          group: bcktGrp.group
        };
        bucketArray[index] = bucketArray[index] ? [...bucketArray[index], bucket] : [bucket];
      });
    });
  } else {
    bucketArray = resultArray;
  }
  if (isGrouped && !loading) {
    bucketArray.forEach((bucket, index) => {
      let totalCallsInABucket = bucket.reduce((a, b) => {
        return a + b.calls;
      }, 0);
      bucket.push({
        ...bucket[bucket.length - 1],
        group: t('in-components:latencyDistributionBase10Chart.others'),
        calls: data.buckets[index].calls > totalCallsInABucket ? data.buckets[index].calls - totalCallsInABucket : 0
      });
    });
  }

  let totalNumberOfCalls = bucketArray.flat().reduce((a, b) => {
    return a + b.calls;
  }, 0);

  if (cachedResult.errors.length > 0 || (timeShiftSubscription && timeShiftSubscriptionResult.errors.length > 0)) {
    return (
      <div className={locals.container}>
        <Message
          type="warning"
          withIcon
          title={t('in-components:chart.resultAwareChartSomethingWentWrong')}
          description={t('in-components:chart.resultAwareChartPleaseTryAgainLater')}
        />
      </div>
    );
  } else if (cachedResult.progress.loading || (timeShiftSubscription && timeShiftSubscriptionResult.progress.loading)) {
    // First time progress received, percentage seems to be empty, so start with 0.2 to have a small arc
    return (
      <div className={locals.container}>
        <LoadingIndicator height={chartHeight} size="xxl" />
      </div>
    );
  } else if (
    // all buckets are empty (have 0 calls)
    totalNumberOfCalls === 0 &&
    (!timeShiftSubscription ||
      timeShiftSubscriptionResult.data.buckets.map(b => b.calls).reduce((a, b) => a + b, 0) === 0)
  ) {
    return (
      <div className={locals.container}>
        <NoDataAvailable
          width={chartWidth}
          height={chartHeight}
          text={t('in-components:latencyDistributionBase10Chart.presenterLabelNoDataToDisplay')}
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
      ? t('in-components:latencyDistributionBase10Chart.presenterLabelTraces')
      : t('in-components:latencyDistributionBase10Chart.presenterLabelCalls');
  const chartConfig = {
    config: {
      y1: {
        labels: [metricName],
        metricIds: [metricName],
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
    chartConfig.config.y1.metricIds.push(metricName);
    chartConfig.config.y1.colors100.push(colorLatencyTimeShift);
    chartConfig.config.y1.timeShifts.push({ offset: timeShiftConfig.offset });
  }
  const enabledMetric = !filteredDataSeries.has('y1-0');
  const enabledTimeShiftMetric = timeShiftEnabled && !filteredDataSeries.has('y1-1');

  // The grouping of data in the buckets are all based on whole numbers. But because of the grouping the to and from become integers.
  // We use Math.ceil to round the numbers to fit the buckets and filters since they also only use whole numbers.

  const timeShiftBuckets = timeShiftSubscriptionResult?.data?.buckets;
  const percentileBuckets = createPercentileBuckets(
    isGrouped && !loading ? resultArray[0]?.buckets : resultArray,
    data.percentiles
  );
  const bucketLength = bucketArray.length;
  // Buckets should be at least 4 pixels wide. At least 1 pixel will be used for a
  // gap between bars.
  const bucketWidth = Math.max(4, chartWidth / bucketLength);
  // Round the bucket center downward to its nearest integer to avoid positioning
  // issues related to decimal pixel values.
  const bucketCenter = Math.floor(bucketWidth / 2);

  // hight of the percentile marker strip which sits directly above the chart
  const percentileStripHeight = Math.floor(0.725 * 16 + 20);
  const maxCallCount = Math.max(
    enabledMetric ? getMaxCallCount(bucketArray, isGrouped, loading) : 0,
    enabledTimeShiftMetric ? getMaxCallCount(timeShiftBuckets) : 0
  );
  const header = (showHeader || showPercentileMenu) && (
    <div className={locals.header}>
      {showHeader && (
        <div className={locals.titleWrapper}>
          <span className={locals.title}>
            {title}
            {aggregation && <span className={locals.aggregation}> ({aggregation})</span>}
          </span>
          {hasApproximateData && (
            <MultiLineToolTipIcon
              lines={[
                fastQueryModeEnabled
                  ? t('in-components:approximateDataIndicator.dataRetentionOrFastQueryMode')
                  : t('in-components:approximateDataIndicator.dataRetention')
              ]}
              withMargin
              iconSize="xs"
            />
          )}
        </div>
      )}
      {showPercentileMenu && (
        <PercentileMenu
          percentilesShown={percentilesShown}
          onChange={percentiles => setPercentilesShown(percentiles)}
        />
      )}
    </div>
  );
  return (
    <>
      {header}
      {showLegend && <ChartLegend chart={chartConfig} />}
      <div className={locals.container} style={{ width: chartWidth }}>
        {
          // for consistency with other charts hide the vertical axis when no metric is selected
          (enabledMetric || enabledTimeShiftMetric) && (
            <VerticalAxis
              scale={{ from: 0, to: maxCallCount }}
              height={chartHeight - percentileStripHeight}
              style={{
                marginTop: percentileStripHeight,
                backgroundColor: themes.default.ids.color.option.white,
                position: 'absolute',
                zIndex: 1 // z-index__axisLabel from shared
              }}
              tickLabelBackgroundColor={themes.default.ids.color.option.white}
            />
          )
        }
        <div style={{ height: chartHeight }}>
          <HistogramChartOverlay
            buckets={isGrouped && !loading ? bucketArray : bucketArray.map(bucket => [bucket])}
            bucketWidth={bucketWidth}
            bucketCenter={bucketCenter}
            height={chartHeight - percentileStripHeight}
            width={chartWidth}
            selectionMenuItems={selectionMenuItems}
            onSelectionChanged={onSelectionChanged}
            selectionAdjustable={selectionAdjustable}
            selection={selection}
            renderWidgetNotSupportedIndicator={renderWidgetNotSupportedIndicator}
            tooltipRenderer={{
              render: function TooltipRenderer({ from, to, style }) {
                let metricBuckets = getMetricBuckets(
                  isGrouped,
                  loading,
                  bucketArray,
                  timeShiftBuckets,
                  from,
                  to,
                  selection
                );
                if (isGrouped) {
                  updateChartConfig(chartConfig, chartableDataSeries, metricBuckets);
                }

                return isGrouped && !chartableDataSeries ? null : (
                  <Tooltip
                    metricBuckets={metricBuckets}
                    percentileBuckets={percentileBuckets?.slice(from, to)}
                    config={chartConfig.config}
                    style={style}
                    isGrouped={isGrouped}
                  />
                );
              }
            }}
          />
          {timeShiftEnabled ? (
            <LineChart
              metricBuckets={[bucketArray, timeShiftBuckets].filter(Boolean)}
              config={chartConfig.config}
              bucketWidth={bucketWidth}
              maxCallCount={maxCallCount}
              // 1 pixel less for the horizontal axis
              height={chartHeight - percentileStripHeight - 1}
              width={chartWidth}
              style={{ bottom: 0 }}
            />
          ) : (
            <HistogramBarChart
              buckets={formatLatencyBuckets(bucketArray, selection, isGrouped, loading)}
              config={chartConfig.config}
              bucketWidth={bucketWidth}
              maxValue={maxCallCount}
              // 1 pixel less for the horizontal axis
              height={chartHeight - percentileStripHeight - 1}
              style={{ bottom: 0 }}
              chartableDataSeries={chartableDataSeries}
              isGrouped={isGrouped}
            />
          )}
          {
            // percentile markers are based on the normal metric (without time-shift), show it only if enabled
            enabledMetric && (
              <PercentileMarkers
                percentileBuckets={percentileBuckets}
                bucketWidth={bucketWidth}
                bucketCenter={bucketCenter}
                chartHeight={chartHeight}
                percentilesShown={percentilesShown}
              />
            )
          }
          <HorizontalAxis
            buckets={resultArray.length ? (isGrouped && !loading ? resultArray[0]?.buckets : resultArray) : []}
            bucketWidth={bucketWidth}
            bucketCenter={bucketCenter}
          />
          <HorizontalLines
            nbBars={4}
            height={chartHeight - percentileStripHeight}
            width={bucketWidth * bucketLength}
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

function getMaxCallCount(buckets, isGrouped, loading) {
  let max = 0;
  for (let i = 0; i < buckets.length; i++) {
    let sumOfCalls = 0;
    if (isGrouped && !loading) {
      sumOfCalls = 0;
      buckets[i].forEach(bucket => {
        sumOfCalls = sumOfCalls + bucket.calls;
      });
      if (sumOfCalls > max) {
        max = sumOfCalls;
      }
    } else {
      if (buckets[i].calls > max) {
        max = buckets[i].calls;
      }
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

function getMetricBuckets(isGrouped, loading, bucketArray, timeShiftBuckets, from, to, selection) {
  let metricBuckets =
    isGrouped && !loading
      ? // TODO: this needs investigation and adoption for case of [...undefined]
        // eslint-disable-next-line no-unsafe-optional-chaining
        [...bucketArray?.slice(from, to), timeShiftBuckets?.slice(from, to)].filter(Boolean)
      : [bucketArray?.slice(from, to), timeShiftBuckets?.slice(from, to)].filter(Boolean);

  if (
    !isGrouped ||
    (isGrouped &&
      Object.keys(selection).length &&
      (metricBuckets[0][0].from < selection.from || metricBuckets[0][0].from >= selection.to))
  ) {
    metricBuckets = [
      [
        metricBuckets[0].reduce(
          (obj, item) => ({ ...item, calls: obj.calls ? obj.calls + item.calls : item.calls, group: null }),
          {}
        )
      ]
    ];
  }
  return metricBuckets;
}

const formatLatencyBuckets = (bucketArray, selection, isGrouped, loading) => {
  let formattedBucketArray = [];
  if (isGrouped && !loading) {
    bucketArray.forEach(buckets => {
      if (selection && (buckets[0].from < selection.from || buckets[0].from >= selection.to)) {
        buckets = buckets.reduce((obj, item) => {
          return { ...item, calls: obj.calls ? obj.calls + item.calls : item.calls };
        }, {});
        formattedBucketArray.push(buckets);
      } else {
        formattedBucketArray.push(buckets);
      }
    });
  } else {
    formattedBucketArray = bucketArray;
  }
  return formattedBucketArray;
};

const updateChartConfig = (chartConfig, chartableDataSeries, metricBuckets) => {
  chartConfig.config['y1'].colors100 = metricBuckets.flat(1).some(bucket => {
    return !bucket.group;
  })
    ? [`var(--ids-color-option-neutral-300`]
    : // TODO: this needs investigation and adoption for case of [...undefined]
      // eslint-disable-next-line no-unsafe-optional-chaining
      [...chartableDataSeries?.map(data => data.color), `var(--ids-color-option-neutral-600`];
};
