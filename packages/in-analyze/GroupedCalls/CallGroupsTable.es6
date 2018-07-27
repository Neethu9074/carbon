import React, { Fragment } from 'react';

import { Table, Thead, Tbody, Tr } from 'in-components/tables/sharedComponents';
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
              technicalName="group"
              label="Group"
            />
            <SortableCallColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="ASC"
              technicalName="calls"
              label="Calls"
            />
            <SortableCallColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="firstTimestamp"
              label="Time"
            />
            <SortableCallColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="latency"
              label="Latency"
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
          {canLoadMore && <LoadMoreRow loadMore={loadMore} cols={5} size="compact" />}
        </Tbody>
      </Table>
    </Fragment>
  );
}
