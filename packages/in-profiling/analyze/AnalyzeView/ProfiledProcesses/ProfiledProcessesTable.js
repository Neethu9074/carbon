/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Table, Thead, Tbody, Tr, TableLoadMoreRow, Th } from '@instana/components';

import Rows from 'in-profiling/analyze/AnalyzeView/ProfiledProcesses/Rows';
import { t } from 'in-i18n';

export default function ProfiledProcessesTable(props) {
  const { loadMore, canLoadMore } = props;
  const columnCount = 2;

  return (
    <Table>
      <Thead>
        <Tr size="compact">
          <Th noWrap>{t('in-profiling:process')}</Th>
          <Th noWrap>{t('in-profiling:host')}</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Rows {...props} cols={columnCount} />
        {canLoadMore && <TableLoadMoreRow loadMore={loadMore} size="compact" cols={columnCount} />}
      </Tbody>
    </Table>
  );
}
