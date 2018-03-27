import React from 'react';

import { Tr, Td } from 'in-components/tables/sharedComponents/Table';
import Button from 'in-new-components/Button';

import locals from './LoadMoreRow.mless';

export default function LoadMoreRow({ cols, loadMore, label = 'Load More' }) {
  return (
    <Tr>
      <Td colSpan={cols} className={locals.cell}>
        <Button
          kind="secondary"
          size="compact"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            loadMore();
          }}
        >
          {label}
        </Button>
      </Td>
    </Tr>
  );
}
