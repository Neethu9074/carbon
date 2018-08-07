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
  callGroupColors
}) {
  return (
    <Fragment>
      {items.map((item, groupIndex) => (
        <Group
          key={item.name}
          orderBy={orderBy}
          orderDirection={orderDirection}
          item={item}
          filters={filters}
          onChangeFilters={onChangeFilters}
          dotColor={callGroupColors[groupIndex]}
        />
      ))}

      <HorizontalIndicatorRow cols={5} progress={progress} />
      <ErrorRows cols={5} errors={errors} size="compact" />
      {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={5} />}
    </Fragment>
  );
}
