import React, { Fragment } from 'react';

import { ErrorRows, HorizontalIndicatorRow, LoadingSkeletonRows } from 'in-components/tables/sharedComponents';

export default function Groups({
  items,
  filters,
  onChangeFilters,
  errors,
  progress,
  orderBy,
  orderDirection,
  groupColors,
  groupComponent: Group
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
          dotColor={groupColors[groupIndex]}
        />
      ))}

      <HorizontalIndicatorRow cols={5} progress={progress} />
      <ErrorRows cols={5} errors={errors} size="compact" />
      {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={5} />}
    </Fragment>
  );
}
