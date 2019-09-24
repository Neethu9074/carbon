import React, { Fragment } from 'react';

const maximumDataSeriesInChart = 5;

export default function Groups({
  dataSource,
  items,
  filters,
  onChangeAnalyzeConfig,
  onChangeAnalyzeConfigAndGetAsUrlObservable,
  orderBy,
  orderDirection,
  groupColors,
  groupComponent: Group,
  isChartSectionExpanded,
  metrics,
  availableMetrics
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
    </Fragment>
  );
}
