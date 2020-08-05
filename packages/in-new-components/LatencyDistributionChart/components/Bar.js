import React from 'react';

import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { number } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';
import theme from 'in-themes';

import locals from './Bar.mless';

export default function Bar({
  bucket,
  buckets,
  maxDataValue,
  height,
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  includeSyntheticCalls
}) {
  const filters = filterForLink(bucket);

  return (
    <Tooltip themeStyle="light" content={TooltipContent(bucket)}>
      <Link
        className={locals.barOuter}
        style={{
          width: `calc((100% / ${buckets.length}) - 2%)`,
          height: `${height}px`
        }}
        href$={getJumpToAnalyzeHref$(
          { applicationId, serviceId, endpointId },
          {
            boundaryScope: boundaryScope,
            groupByTag: {},
            filters: includeSyntheticCalls ? [{ name: 'include_synthetic', value: 'true' }, ...filters] : [...filters]
          }
        )}
      >
        <div
          style={{
            width: `100%`,
            height: `${calculateHeightInPx(maxDataValue, bucket.calls, height)}px`
          }}
          className={locals.barInner}
        />
      </Link>
    </Tooltip>
  );
}

function filterForLink(bucket) {
  let filters = [];

  const from = bucket.from;
  const to = bucket.to;

  const latencyFilters = [
    {
      name: 'call.latency',
      value: bucket.from,
      operator: 'GREATER_OR_EQUAL_THAN'
    },
    {
      name: 'call.latency',
      value: bucket.to,
      operator: 'LESS_THAN'
    }
  ];

  if (from === to) {
    filters.push({
      name: 'call.latency',
      value: bucket.from,
      operator: 'EQUALS',
      entity: 'NOT_APPLICABLE'
    });
  } else if (from === 0) {
    filters.push({
      name: 'call.latency',
      value: bucket.to,
      operator: 'LESS_THAN',
      entity: 'NOT_APPLICABLE'
    });
  } else {
    filters = [...latencyFilters];
  }

  return filters;
}

function calculateHeightInPx(maxDataValue, calls, height) {
  const percentage = (calls / maxDataValue) * 100;
  const heightInPx = (percentage / 100) * height;
  return heightInPx;
}

const TooltipContent = bucket => {
  return (
    <div className={locals.tooltipContent}>
      <div className={locals.labelWrapper}>
        <div style={{ background: theme.lib.colors.chart.strokeColors100[0] }} className={locals.dot} />
        Calls
      </div>
      <span className={locals.value}>{number.forcedCompact.detailed(bucket.calls)}</span>
    </div>
  );
};
