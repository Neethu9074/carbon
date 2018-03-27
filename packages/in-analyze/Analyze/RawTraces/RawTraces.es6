import { compose } from 'recompose';
import React from 'react';

import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import HorizontalIndicator from 'in-components/Progress/HorizontalIndicator';
import getTraces from 'in-subscription/application/getTraces';
import cursorPaginated from 'in-hoc/cursorPaginated';
import Button from 'in-new-components/Button';

export default compose(
  cursorPaginated({
    getResettingProps: () => ['filter', 'orderBy', 'orderDirection'],
    get: ({ cursor, filter, orderBy, orderDirection }) =>
      getTraces({
        pagination: {
          cursor,
          retrievalSize: 50
        },
        order: {
          by: orderBy,
          direction: orderDirection
        },
        filter
      })
  })
)(RawTraces);

function RawTraces({ items, errors, progress, loadMore, reload, canLoadMore, totalHits }) {
  return (
    <div>
      <span>Hits: {totalHits}</span>
      <Button onClick={reload}>Reload</Button>

      {items.map(item => <div key={item.traceId}>{item.label}</div>)}

      <HorizontalIndicator progress={progress} />
      <ErroneousResultPresenter errors={errors} />
      {canLoadMore && <Button onClick={loadMore}>Load More</Button>}
    </div>
  );
}
