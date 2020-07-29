import { useState } from 'react';
import React from 'react';

import PercentileMenu, {
  ALL_PERCENTILES
} from 'in-new-components/LatencyDistributionBase10Chart/components/PercentileMenu';
import LatencyChartOverlay from 'in-new-components/LatencyDistributionBase10Chart/components/LatencyChartOverlay';
import PercentileMarkers from 'in-new-components/LatencyDistributionBase10Chart/components/PercentileMarkers';
import HorizontalAxis from 'in-new-components/LatencyDistributionBase10Chart/components/HorizontalAxis';
import BarChart from 'in-new-components/LatencyDistributionBase10Chart/components/BarChart';
import { HEIGHT as horizontalAxisHeight } from 'in-new-components/Axis/HorizontalAxis';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import VerticalAxis from 'in-new-components/Axis/VerticalAxis';
import useObservable from 'in-hooks/useObservable';
import theme from 'in-themes';

import locals from './LatencyDistributionBase10ChartPresenter.mless';

export default function LatencyDistributionBase10ChartPresenter({
  height,
  width,
  customWidth,
  customHeight,
  showPercentileMenu,
  showLegend,
  selectionAdjustable,
  subscription,
  selectionMenuItems,
  onSelectionChanged,
  selection,
  dataSource
}) {
  const [percentilesShown, setPercentilesShown] = useState(ALL_PERCENTILES);

  const subscriptionResult = useObservable(subscription, [subscription]);

  if (!width || !subscriptionResult) {
    return <div style={{ height: customHeight || height }} className={locals.histogram} />;
  }

  const chartWidth = customWidth || width;
  const chartHeight = (customHeight || height) - horizontalAxisHeight;

  if (subscriptionResult.errors.length > 0) {
    return (
      <div className={locals.container}>
        <NoDataAvailable width={chartWidth} height={chartHeight} icon={'lib_bar_chart'} />
      </div>
    );
  } else if (subscriptionResult.progress.loading) {
    // First time progress received, percentage seems to be empty, so start with 0.2 to have a small arc
    return (
      <div className={locals.container}>
        <LoadingIndicator height={chartHeight} />
      </div>
    );
  } else if (subscriptionResult.data.buckets.map(b => b.calls).reduce((a, b) => a + b, 0) === 0) {
    return (
      <div className={locals.container}>
        <NoDataAvailable width={chartWidth} height={chartHeight} icon={'lib_bar_chart'} text={'No data to display'} />
      </div>
    );
  }

  // The grouping of data in the buckets are all based on whole numbers. But because of the grouping the to and from become integers.
  // We use Math.ceil to round the numbers to fit the buckets and filters since they also only use whole numbers.
  const data = subscriptionResult.data || { buckets: [] };
  const buckets = data.buckets;
  const percentileBuckets = createPercentileBuckets(buckets, data.percentiles);

  // Buckets should be at least 4 pixels wide. At least 1 pixel will be used for a
  // gap between bars.
  const bucketWidth = Math.max(4, chartWidth / buckets.length);
  // Round the bucket center downward to its nearest integer to avoid positioning
  // issues related to decimal pixel values.
  const bucketCenter = Math.floor(bucketWidth / 2);

  // hight of the percentile marker strip which sits directly above the chart
  const percentileStripHeight = Math.floor(0.725 * 16 + 20);
  const maxCallCount = getMaxCallCount(buckets);
  return (
    <>
      <div className={locals.header}>
        {showLegend && (
          <div className={locals.legend}>
            <div className={locals.dot} />
            {dataSource === 'calls' ? 'Calls' : 'Traces'}
          </div>
        )}
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
        <div style={{ height: chartHeight }}>
          <LatencyChartOverlay
            buckets={buckets}
            percentileBuckets={percentileBuckets}
            bucketWidth={bucketWidth}
            bucketCenter={bucketCenter}
            height={chartHeight - percentileStripHeight}
            width={chartWidth}
            selectionMenuItems={selectionMenuItems}
            onSelectionChanged={onSelectionChanged}
            selectionAdjustable={selectionAdjustable}
            selection={selection}
            dataSource={dataSource}
          />
          <BarChart
            buckets={buckets}
            bucketWidth={bucketWidth}
            maxCallCount={maxCallCount}
            // 1 pixel less for the horizontal axis
            height={chartHeight - percentileStripHeight - 1}
            style={{ bottom: 0 }}
          />
          <PercentileMarkers
            percentileBuckets={percentileBuckets}
            bucketWidth={bucketWidth}
            bucketCenter={bucketCenter}
            chartHeight={chartHeight}
            percentilesShown={percentilesShown}
          />
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
