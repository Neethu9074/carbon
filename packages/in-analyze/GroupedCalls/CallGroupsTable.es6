import React, { Fragment } from 'react';

import { Table, Thead, Tbody, Tr, Th } from 'in-components/tables/sharedComponents';
import SortableCallColumn from 'in-analyze/RawCalls/SortableCallColumn';
import { LoadMoreRow } from 'in-components/tables/sharedComponents';
import Groups from 'in-analyze/GroupedCalls/Groups';

import locals from './CallGroupsTable.mless';

export default function CallGroupsTable(props) {
  const { orderBy, orderDirection, onChangeOrder, loadMore, canLoadMore } = props;
  return (
    <Fragment>
      <Table className={locals.table}>
        <Thead>
          <Tr size="compact">
            <SortableCallColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="ASC"
              technicalName="label"
              label="Group"
            />
            <Th>Started At</Th>
            <SortableCallColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="duration"
              label="Avg. Duration"
            />
            <SortableCallColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="errors"
              label="Error Rate"
            />
          </Tr>
        </Thead>
        <Tbody>
          <Groups {...props} />
        </Tbody>
      </Table>
      {canLoadMore && <LoadMoreRow loadMore={loadMore} cols={4} size="compact" />}
    </Fragment>
  );
}
