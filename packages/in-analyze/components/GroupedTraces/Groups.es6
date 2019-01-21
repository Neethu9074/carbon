import React, { Fragment } from 'react';

import { ErrorRows, HorizontalIndicatorRow, LoadingSkeletonRows } from 'in-components/tables/sharedComponents';

const maximumDataSeriesInChart = 5;

export default function Groups({
  dataSource,
  items,
  filters,
  onChangeAnalyzeConfig,
  onChangeAnalyzeConfigAndGetAsUrlObservable,
  errors,
  progress,
  orderBy,
  orderDirection,
  groupColors,
  groupComponent: Group,
  isChartSectionExpanded,
  metrics,
  availableMetrics,
  columnCount = 5
}) {
  return (
    <Fragment>
      {items.map((item, groupIndex) => (
        <Group
          key={item.name}
          dataSource={dataSource}
          orderBy={orderBy}
          orderDirection={orderDirection}
          item={item}
          filters={filters}
          onChangeAnalyzeConfig={onChangeAnalyzeConfig}
          onChangeAnalyzeConfigAndGetAsUrlObservable={onChangeAnalyzeConfigAndGetAsUrlObservable}
          dotColor={groupColors[groupIndex]}
          showDot={isChartSectionExpanded && groupIndex < maximumDataSeriesInChart}
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
