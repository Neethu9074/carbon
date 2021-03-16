/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

const maximumDataSeriesInChart = 5;

export default function Groups({
  dataSource,
  items,
  filters,
  onChangeAnalyzeConfig,
  onChangeAnalyzeConfigAndGetAsUrl,
  orderBy,
  orderDirection,
  groupColors,
  groupComponent: Group,
  showGraph,
  metrics,
  availableMetrics
}) {
  return (
    <Fragment>
      {items.map((item, groupIndex) => (
        <Group
          key={`${item.name}${groupIndex}`}
          dataSource={dataSource}
          orderBy={orderBy}
          orderDirection={orderDirection}
          item={item}
          filters={filters}
          onChangeAnalyzeConfig={onChangeAnalyzeConfig}
          onChangeAnalyzeConfigAndGetAsUrl={onChangeAnalyzeConfigAndGetAsUrl}
          dotColor={groupColors[groupIndex]}
          showDot={showGraph && groupIndex < maximumDataSeriesInChart}
          metrics={metrics}
          availableMetrics={availableMetrics}
        />
      ))}
    </Fragment>
  );
}
