/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ActionColumn from 'in-components/tables/sharedComponents/ActionColumn/ActionColumn';
import { Tr } from 'in-components/tables/sharedComponents/Table';
import { t } from 'in-i18n';

export default function LoadMoreRow({
  depth,
  cols,
  loadMore,
  label = t('in-components:loadMoreRow.loadMore'),
  size,
  className
}) {
  return (
    <Tr depth={depth} size={size} className={className}>
      <ActionColumn cols={cols} onClick={loadMore} label={label} />
    </Tr>
  );
}
