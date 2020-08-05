import React from 'react';

import HorizontalAxis from 'in-new-components/LatencyDistributionChart/components/HorizontalAxis';
import { HEIGHT as horizontalAxisHeight } from 'in-new-components/Axis/HorizontalAxis';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import Bar from 'in-new-components/LatencyDistributionChart/components/Bar';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import VerticalAxis from 'in-new-components/Axis/VerticalAxis';

import locals from './LatencyDistributionChartPresenter.mless';

export default function LatencyDistributionChartPresenter({
  subscription,
  height,
  width,
  customWidth,
  customHeight,
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  includeSyntheticCalls
}) {
  let content;

  const buckets = subscription.data ? subscription.data : [];

  if (!width) {
    return <div style={{ height: customHeight || height }} className={locals.histogram} />;
  }
  // The grouping of data in the buckets are all based on whole numbers. But because of the grouping the to and from become integers.
  // We use Math.ceil to round the numbers to fit the buckets and filters since they also only use whole numbers.
  const data = buckets.map(({ from, to, calls }) => ({
    from: Math.ceil(from),
    to: Math.ceil(to),
    calls
  }));

  const maxDataValue = getMaxDataValue(data);
  width = customWidth || width;
  height = (customHeight || height) - horizontalAxisHeight;

  if (subscription.errors.length > 0) {
    content = <NoDataAvailable width={width} height={height} />;
  } else if (subscription.progress.loading) {
    // First time progress received, percentage seems to be empty, so start with 0.2 to have a small arc
    content = <LoadingIndicator height={height} width={width} />;
  } else {
    content = (
      <>
        <VerticalAxis scale={{ from: 0, to: maxDataValue }} height={height} />
        <div>
          <div className={locals.bars}>
            {data.map(bucket => (
              <Bar
                key={bucket.from}
                bucket={bucket}
                buckets={data}
                maxDataValue={maxDataValue}
                height={height}
                applicationId={applicationId}
                serviceId={serviceId}
                endpointId={endpointId}
                boundaryScope={boundaryScope}
                includeSyntheticCalls={includeSyntheticCalls}
              />
            ))}
          </div>
          <HorizontalAxis buckets={data} width={width} />
        </div>
      </>
    );
  }

  return <div className={locals.container}>{content}</div>;
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
