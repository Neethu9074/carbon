import React, { Fragment } from 'react';

import {
  ErrorRows,
  HorizontalIndicatorRow,
  LoadingSkeletonRows,
  LoadMoreRow
} from 'in-components/tables/sharedComponents';
import Group from 'in-analyze/Analyze/TraceGroups/Group';

export default function Groups({
  items,
  errors,
  progress,
  loadMore,
  canLoadMore,
  depth,
  filter,
  orderBy,
  orderDirection
}) {
  return (
    <Fragment>
      {items.map(item => (
        <Group
          key={item.name}
          orderBy={orderBy}
          orderDirection={orderDirection}
          filter={filter}
          depth={depth}
          item={item}
        />
      ))}

      <HorizontalIndicatorRow cols={4} progress={progress} />
      <ErrorRows cols={4} errors={errors} />
      {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={4} />}
      {canLoadMore && <LoadMoreRow loadMore={loadMore} cols={4} depth={depth} />}
    </Fragment>
  );
}
