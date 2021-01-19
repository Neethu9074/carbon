/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import { ErrorRows, HorizontalIndicatorRow, LoadingSkeletonRows } from 'in-components/tables/sharedComponents';

const maximumDataSeriesInChart = 5;

export default function Groups({
  items,
  errors,
  progress,
  orderBy,
  orderDirection,
  groupColors,
  groupComponent: Group,
  showGraph,
  getGroupAsFilterUrl,
  metrics,
  availableMetrics,
  columnCount = 5
}) {
  return (
    <Fragment>
      {items.map((item, groupIndex) => (
        <Group
          key={item.name}
          orderBy={orderBy}
          orderDirection={orderDirection}
          item={item}
          dotColor={groupColors[groupIndex]}
          showDot={showGraph && groupIndex < maximumDataSeriesInChart}
          getGroupAsFilterUrl={getGroupAsFilterUrl}
          metrics={metrics}
          availableMetrics={availableMetrics}
        />
      ))}

      <HorizontalIndicatorRow cols={columnCount} progress={progress} />
      <ErrorRows cols={columnCount} errors={errors} size="compact" />
      {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={columnCount} />}
    </Fragment>
  );
}
