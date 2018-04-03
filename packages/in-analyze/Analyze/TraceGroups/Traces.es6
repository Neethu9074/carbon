import React, { Fragment } from 'react';
import { compose } from 'recompose';

import { number, millis } from 'in-services/formatters/number';
import {
  Tr,
  Td,
  HorizontalIndicatorRow,
  LoadingSkeletonRows,
  ErrorRows,
  LoadMoreRow,
  Link
} from 'in-components/tables/sharedComponents';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import getTraces from 'in-subscription/application/getTraces';
import cursorPaginated from 'in-hoc/cursorPaginated';

const orderTranslation = {
  label: 'rootEndpointLabel',
  duration: 'duration',
  errors: 'totalErrorCount'
};

export default compose(
  cursorPaginated({
    getResettingProps: () => ['filter', 'orderBy', 'orderDirection'],
    get: ({ cursor, filter, orderBy, orderDirection }) =>
      getTraces({
        pagination: {
          cursor,
          retrievalSize: 20
        },
        order: {
          by: orderTranslation[orderBy] || 'startTime',
          direction: orderDirection
        },
        filter
      })
  })
)(Traces);

function Traces({ items, errors, progress, loadMore, canLoadMore, depth }) {
  return (
    <Fragment>
      {items.map(item => (
        <Tr key={item.traceId} depth={depth}>
          <Td colSpan={2}>
            <Link href$={getLinkToTraceDetail(item.traceId)}>{item.label}</Link>
          </Td>
          <Td>{millis.fixedCompact(item.duration)}</Td>
          <Td>{number.compact(item.totalErrorCount)}</Td>
        </Tr>
      ))}

      <HorizontalIndicatorRow cols={4} progress={progress} />
      <ErrorRows cols={4} errors={errors} />
      {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={4} />}
      {canLoadMore && <LoadMoreRow loadMore={loadMore} cols={4} depth={depth} />}
    </Fragment>
  );
}
