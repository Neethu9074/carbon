/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { LoadingSkeleton } from '@instana/components';
import { Result } from '@instana/types';

import AggregationSymbol from 'in-components/AggregationSymbol';
import { isLoading } from 'in-services/util/result';
import Tooltip from 'in-components/Tooltip/Tooltip';

import locals from './MetricLabel.mless';

export default function MetricLabel({
  label,
  aggregation
}: {
  label: Result<string | undefined>;
  aggregation: string;
}) {
  if (isLoading(label) || !label.data) {
    return (
      <div className={locals.content}>
        <LoadingSkeleton className={locals.skeleton} />
      </div>
    );
  }
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
