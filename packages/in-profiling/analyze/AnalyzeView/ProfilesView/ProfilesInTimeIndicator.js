import React from 'react';

import { getBlockSizeMillis, getPredefinedBlockSizeMillisForBlockSize } from 'in-services/util/dynamicAggregation';
import useTimeConfigUpdatingScale from 'in-services/hooks/useTimeConfigUpdatingScale';
import { getDefaultMetricRollupDuration } from 'in-stores/metric';
import getElementDimensions from 'in-hoc/getElementDimensions';
import { formatDuration } from 'in-services/formatters/date';
import { formatDateTime } from 'in-services/formatters/date';
import bucketize from 'in-services/util/bucketize';
import Tooltip from 'in-components/Tooltip';

import locals from './ProfilesInTimeIndicator.mless';

export default function ProfilesInTimeIndicator(props) {
  if (!props.profile || !props.profile.rawProfileTimestamps) {
    return null;
  }
  return <WidthAwareProfilesInTimeIndicator {...props} />;
}

const WidthAwareProfilesInTimeIndicator = function WidthAwareProfilesInTimeIndicator({ profile, timeConfig }) {
  return (
    <div className={locals.profilesIndicatorWrapper}>
      <span className={locals.profilesLabel}>Profiles</span>
      <Buckets profile={profile} timeConfig={timeConfig} />
    </div>
  );
};

const Buckets = getElementDimensions(function Buckets({ profile, timeConfig, width }) {
  if (!width) {
    return <div className={locals.bucketsWrapper} />;
  }

  const scale = useTimeConfigUpdatingScale(timeConfig, width);

  const rollup = getDefaultMetricRollupDuration(timeConfig).rollup;
  const blockSizeMillis = getPredefinedBlockSizeMillisForBlockSize(
    getBlockSizeMillis({
      windowSize: timeConfig.windowSize,
      minPixelsPerBlock: 10,
      width,
      rollup
    })
  );
  const bucketSizeInPx = (blockSizeMillis / timeConfig.windowSize) * width - 1;
  const minTimestamp = getSmallestTimestamp(profile.rawProfileTimestamps);
  const bucketResult = bucketize({
    items: profile.rawProfileTimestamps,
    from: minTimestamp || scale.getDomainFrom(),
    bucketSize: blockSizeMillis
  });

  return (
    <div className={locals.bucketsWrapper}>
      {bucketResult.buckets.map((bucket, i) => (
        <Tooltip key={i} themeStyle="light" content={<TooltipContent bucket={bucket} />}>
          <div
            style={{
              height: Math.max(1, 14 * (bucket.items.length / bucketResult.maxItemsPerBucket)),
              left: scale.getRange(bucket.from),
              width: bucketSizeInPx
            }}
            className={locals.profilesIndicator}
          />
        </Tooltip>
      ))}
    </div>
  );
});

function TooltipContent({ bucket }) {
  return (
    <div>
      <div className={locals.tooltipTimeRow}>
        {formatDateTime(bucket.from)}
        <span className={locals.duration}>({formatDuration(bucket.bucketSize)})</span>
      </div>
      <span className={locals.numProfiles}>{bucket.items.length}</span>
      {` `}
      profiles collected
    </div>
  );
}

function getSmallestTimestamp(timestamps) {
  let minTimestamp = timestamps[0];
  for (let i = 1; i < timestamps.length; i++) {
    minTimestamp = Math.min(minTimestamp, timestamps[i]);
  }
  return minTimestamp;
}
