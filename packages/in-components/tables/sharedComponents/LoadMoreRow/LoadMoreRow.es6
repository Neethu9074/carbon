import React from 'react';

import { Tr, Td } from 'in-components/tables/sharedComponents/Table';
import Button from 'in-new-components/Button';

import locals from './LoadMoreRow.mless';

export default function LoadMoreRow({ depth, cols, loadMore, label = 'Load More', size, className }) {
  return (
    <Tr depth={depth} size={size} className={className}>
      <Td colSpan={cols}>
        <div className={locals.wrapper}>
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
      </Td>
    </Tr>
  );
}
