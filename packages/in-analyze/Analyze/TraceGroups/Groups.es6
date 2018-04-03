import React, { Fragment } from 'react';
import { compose } from 'recompose';

import {
  HorizontalIndicatorRow,
  LoadingSkeletonRows,
  ErrorRows,
  LoadMoreRow
} from 'in-components/tables/sharedComponents';
import getTraceGroups from 'in-subscription/application/getTraceGroups';
import Group from 'in-analyze/Analyze/TraceGroups/Group';
import cursorPaginated from 'in-hoc/cursorPaginated';

const orderTranslation = {
  label: 'rootEndpointLabel',
  calls: 'calls',
  duration: 'duration',
  errors: 'errors'
};

export default compose(
  cursorPaginated({
    getResettingProps: () => ['filter', 'orderBy', 'orderDirection'],
    get: ({ cursor, filter, orderBy, orderDirection }) =>
      getTraceGroups({
        pagination: {
          cursor,
          retrievalSize: 20
        },
        order: {
          by: orderTranslation[orderBy] || '',
          direction: orderDirection
        },
        filter,
        metrics: {
          calls: {
            metric: 'calls',
            aggregation: 'SUM'
          },
          duration: {
            metric: 'latency',
            aggregation: 'MEAN'
          },
          errors: {
            metric: 'errors',
            aggregation: 'MEAN'
          }
        }
      })
  })
)(Groups);

function Groups({ items, errors, progress, loadMore, canLoadMore, depth, filter, orderBy, orderDirection }) {
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
