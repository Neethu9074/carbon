/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ActionColumn from 'in-components/tables/sharedComponents/ActionColumn/ActionColumn';
import { Tr } from 'in-components/tables/sharedComponents/Table';

export default function LoadMoreRow({ depth, cols, loadMore, label = 'Load More', size, className }) {
  return (
    <Tr depth={depth} size={size} className={className}>
      <ActionColumn cols={cols} action={loadMore} label={label} />
    </Tr>
  );
}
