/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { Table, Thead, Tbody, Tr, LoadMoreRow } from 'in-components/tables/sharedComponents';
import Rows from 'in-profiling/analyze/AnalyzeView/ProfiledProcesses/Rows';
import { Th } from 'in-components/tables/sharedComponents/Table';

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
        {canLoadMore && <LoadMoreRow loadMore={loadMore} size="compact" cols={columnCount} />}
      </Tbody>
    </Table>
  );
}
