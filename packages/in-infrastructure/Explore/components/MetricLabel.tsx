/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { LoadingSkeleton } from '@instana/components';

import AggregationSymbol from 'in-components/AggregationSymbol';
import { carbonTableEnabled } from 'in-services/featureFlags';
import { isLoading } from 'in-services/util/result';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { Result } from 'in-types';

import locals from './MetricLabel.mless';

export default function MetricLabel({
  label,
  aggregation
}: {
  label: Result<string | undefined>;
  aggregation: string;
}) {
  if (isLoading(label)) {
    return (
      <div className={locals.content}>
        <LoadingSkeleton className={locals.skeleton} />
      </div>
    );
  }

  if (carbonTableEnabled) {
    const labelSpan = (
      <bdi className={label.data && label.data.length > 20 ? locals.bdi : undefined}>
        <div className={locals.carbonHeaderEllipsis}>{label.data}</div>
      </bdi>
    );

    const labelWithTooltip =
      label.data && label.data.length > 10 ? (
        <Tooltip content={label.data ? label.data : label} align="auto">
          {labelSpan}
        </Tooltip>
      ) : (
        labelSpan
      );

    return (
      <div className={locals.carbonHeadercontent}>
        {labelWithTooltip}
        {aggregation && (
          <span className={locals.aggregation}>
            <AggregationSymbol aggregation={aggregation} />
          </span>
        )}
      </div>
    );
  }

  const labelSpan = (
    <div className={locals.label}>
      <bdi>{label.data}</bdi>
    </div>
  );
  // take a guess that the content will be truncated, although this is a bit hacky because
  // the truncation happens in CSS
  const labelWithTooltip =
    label.data && label.data.length > 20 ? (
      <Tooltip content={label.data} align="auto" overflowEllipsis>
        {labelSpan}
      </Tooltip>
    ) : (
      labelSpan
    );

  return (
    <div className={locals.content}>
      {labelWithTooltip}
      {aggregation && (
        <span className={locals.aggregation}>
          <AggregationSymbol aggregation={aggregation} />
        </span>
      )}
    </div>
  );
}
