import React from 'react';

import HorizontalAxis from 'in-new-components/LatencyDistributionBase10Chart/components/HorizontalAxis';
import PercentileMenu from 'in-new-components/LatencyDistributionBase10Chart/components/PercentileMenu';
import Bucket from 'in-new-components/LatencyDistributionBase10Chart/components/Bucket';
import { HEIGHT as horizontalAxisHeight } from 'in-new-components/Axis/HorizontalAxis';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import LoadingIndicator from '../LoadingIndicators/LoadingIndicator';
import VerticalAxis from 'in-new-components/Axis/VerticalAxis';
import { List, Map } from 'immutable';
import theme from 'in-themes';

import locals from './LatencyDistributionBase10ChartPresenter.mless';

export default class LatencyDistributionBase10ChartPresenter extends React.Component {
  static displayName = 'LatencyDistributionBase10ChartPresenter';

  constructor(props) {
    super(props);

    this.state = { percentilesShown: enabledPercentiles };
  }

  render() {
    const {
      subscription,
      height,
      width,
      customWidth,
      customHeight,
      chartDefinition,
      showPercentileMenu = true
    } = this.props;
    const { percentilesShown } = this.state;

    const buckets = subscription.data ? subscription.data : [];

    if (!width) {
      return <div style={{ height: customHeight || height }} className={locals.histogram} />;
    }
    // The grouping of data in the buckets are all based on whole numbers. But because of the grouping the to and from become integers.
    // We use Math.ceil to round the numbers to fit the buckets and filters since they also only use whole numbers.
    const data = buckets;

    const chartWidth = customWidth || width;
    const chartHeight = (customHeight || height) - horizontalAxisHeight;

    if (subscription.errors.length > 0) {
      return (
        <div className={locals.container}>
          <NoDataAvailable width={chartWidth} height={chartHeight} icon={'lib_bar_chart'} />
        </div>
      );
    } else if (subscription.progress.loading) {
      // First time progress received, percentage seems to be empty, so start with 0.2 to have a small arc
      return (
        <div className={locals.container}>
          <LoadingIndicator height={chartHeight} />
        </div>
      );
    }
    const bucketWidth = `calc(75% / ${buckets.length})`;
    const percentileHeight = 0.725 * 16 + 10; // rem to px conversion
    const maxDataValue = getMaxDataValue(data);
    return (
      <>
        <div className={locals.legend}>
          <div className={locals.metric}>
            <div className={locals.dot} style={{ background: theme.lib.colors.chart.strokeColors100[0] }} />
            Calls
          </div>
          {showPercentileMenu && (
            <PercentileMenu
              percentilesShown={percentilesShown}
              selectPercentile={this.selectPercentile}
              selectAllPercentiles={this.selectAllPercentiles}
              selectNoPercentile={this.selectNoPercentile}
            />
          )}
        </div>
        <div className={locals.container}>
          <VerticalAxis
            scale={{ from: 0, to: maxDataValue }}
            height={chartHeight - percentileHeight}
            style={{ marginTop: percentileHeight, zIndex: 5, backgroundColor: 'white' }}
          />
          <div>
            <div className={locals.bars}>
              {buckets.map(bucket => (
                <Bucket
                  key={bucket.from || 0}
                  bucket={bucket}
                  bucketWidth={bucketWidth}
                  maxDataValue={maxDataValue}
                  height={chartHeight}
                  percentileHeight={percentileHeight}
                  percentilesShown={percentilesShown.filter(p => p.get('enabled')).map(p => p.get('value'))}
                  formatter={chartDefinition.formatter}
                />
              ))}
            </div>
            <HorizontalAxis
              buckets={buckets}
              bucketWidth={bucketWidth}
              width={chartWidth}
              formatter={chartDefinition.formatter}
            />
            <HorizontalLines
              nbBars={4}
              height={chartHeight - percentileHeight}
              width={chartWidth}
              style={{ marginTop: percentileHeight }}
            />
          </div>
        </div>
      </>
    );
  }

  selectPercentile = index => {
    this.setState(state => ({
      percentileShown: (state.percentilesShown = state.percentilesShown.update(index, undefined, value =>
        value.update('enabled', true, enabled => !enabled)
      ))
    }));
  };
  selectAllPercentiles = () => {
    this.setState(state => ({ percentileShown: (state.percentilesShown = enabledPercentiles) }));
  };
  selectNoPercentile = () => {
    this.setState(state => ({ percentileShown: (state.percentilesShown = disabledPercentiles) }));
  };
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

function getMaxDataValue(data) {
  let max = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].calls > max) {
      max = data[i].calls;
    }
  }
  return max;
}

const percentiles = List.of(50, 90, 95, 99);
const enabledPercentiles = percentiles.map(p => Map({ value: p, enabled: true }));
const disabledPercentiles = percentiles.map(p => Map({ value: p, enabled: false }));
