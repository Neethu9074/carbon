import { useState } from 'react';
import React from 'react';

import PercentileMenu, {
  ALL_PERCENTILES
} from 'in-new-components/LatencyDistributionBase10Chart/components/PercentileMenu';
import LatencyChartOverlay from 'in-new-components/LatencyDistributionBase10Chart/components/LatencyChartOverlay';
import HorizontalAxis from 'in-new-components/LatencyDistributionBase10Chart/components/HorizontalAxis';
import BarChart from 'in-new-components/LatencyDistributionBase10Chart/components/BarChart';
import { HEIGHT as horizontalAxisHeight } from 'in-new-components/Axis/HorizontalAxis';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import VerticalAxis from 'in-new-components/Axis/VerticalAxis';
import useObservable from 'in-hooks/useObservable';

import locals from './LatencyDistributionBase10ChartPresenter.mless';

export default function LatencyDistributionBase10ChartPresenter({
  height,
  width,
  customWidth,
  customHeight,
  showPercentileMenu,
  showLegend,
  subscription,
  selectionMenuItems,
  onSelectionChanged
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

  const percentileHeight = Math.floor(0.725 * 16 + 20);
  const maxCallCount = getMaxCallCount(buckets);
  return (
    <>
      <div className={locals.header}>
        {showLegend && (
          <div className={locals.legend}>
            <div className={locals.dot} />
            Calls
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
          height={chartHeight - percentileHeight}
          style={{ marginTop: percentileHeight, backgroundColor: 'white', position: 'absolute' }}
        />
        <div className={locals.chart} style={{ height: chartHeight }}>
          <LatencyChartOverlay
            buckets={buckets}
            percentileBuckets={percentileBuckets}
            bucketWidth={bucketWidth}
            bucketCenter={bucketCenter}
            height={chartHeight - percentileHeight}
            width={chartWidth}
            selectionMenuItems={selectionMenuItems}
            onSelectionChanged={onSelectionChanged}
          />
          <BarChart
            buckets={buckets}
            percentileBuckets={percentileBuckets}
            bucketWidth={bucketWidth}
            bucketCenter={bucketCenter}
            maxCallCount={maxCallCount}
            chartHeight={chartHeight}
            percentileHeight={percentileHeight}
            percentilesShown={percentilesShown}
          />
          <HorizontalAxis buckets={buckets} bucketWidth={bucketWidth} bucketCenter={bucketCenter} />
          <HorizontalLines
            nbBars={4}
            height={chartHeight - percentileHeight}
            width={bucketWidth * buckets.length}
            style={{ marginTop: percentileHeight }}
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
 * e.g., [{50:0}, {}, {90:6, 95:10}, ...].
 *
 * @param {*} buckets - Array of latency distribution buckets [{from: 0, to: 1, tickMark: true, calls: 2033}, ...].
 * @param {*} percentiles - Object with percentiles as keys and latencies as values, e.g., {50: 0, 90: 6, 95: 10, 99: 122}.
 */
function createPercentileBuckets(buckets, percentiles) {
  return buckets.map(bucket => {
    return Object.keys(percentiles)
      .filter(
        percentile =>
          (bucket.from == null || bucket.from <= percentiles[percentile]) &&
          (bucket.to == null || percentiles[percentile] < bucket.to)
      )
      .map(percentile => ({ [percentile]: percentiles[percentile] }))
      .reduce((prev, cur) => Object.assign(prev, cur), {});
  });
}
