import React, { Fragment } from 'react';

import { ErrorRows, HorizontalIndicatorRow, LoadingSkeletonRows } from 'in-components/tables/sharedComponents';
import Group from 'in-analyze/GroupedTraces/Group';

export default function Groups({ items, errors, progress, filter, orderBy, orderDirection, traceGroupColors }) {
  return (
    <Fragment>
      {items.map((item, groupIndex) => (
        <Group
          key={item.name}
          orderBy={orderBy}
          orderDirection={orderDirection}
          filter={filter}
          item={item}
          dotColor={traceGroupColors[groupIndex]}
        />
      ))}

      <HorizontalIndicatorRow cols={4} progress={progress} />
      <ErrorRows cols={4} errors={errors} size="compact" />
      {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={4} />}
    </Fragment>
  );
}
