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
  isChartSectionExpanded
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
          showDot={isChartSectionExpanded && groupIndex < maximumDataSeriesInChart}
        />
      ))}

      <HorizontalIndicatorRow cols={5} progress={progress} />
      <ErrorRows cols={5} errors={errors} size="compact" />
      {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={5} />}
    </Fragment>
  );
}
