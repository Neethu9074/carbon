import React from 'react';

import Button from 'in-new-components/Button';

import locals from './LoadMoreRow.mless';

export default function LoadMoreRow({ loadMore, label = 'Load More' }) {
  return (
    <div className={locals.loadMoreRow}>
      <Button
        kind="action"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          loadMore();
        }}
      >
        {label}
      </Button>
    </div>
  );
}
