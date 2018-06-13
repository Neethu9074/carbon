import React, { Fragment } from 'react';

import { ErrorRows, HorizontalIndicatorRow, LoadingSkeletonRows } from 'in-components/tables/sharedComponents';
import Group from 'in-analyze/GroupedCalls/Group';

export default function Groups({
  items,
  filters,
  onChangeFilters,
  errors,
  progress,
  orderBy,
  orderDirection,
  traceGroupColors
}) {
  return (
    <Fragment>
      {items.map((item, groupIndex) => (
        <Group
          key={groupIndex}
          orderBy={orderBy}
          orderDirection={orderDirection}
          item={item}
          filters={filters}
          onChangeFilters={onChangeFilters}
          dotColor={traceGroupColors[groupIndex]}
        />
      ))}

      <HorizontalIndicatorRow cols={4} progress={progress} />
      <ErrorRows cols={4} errors={errors} size="compact" />
      {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={4} />}
    </Fragment>
  );
}
