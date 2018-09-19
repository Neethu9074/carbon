import React, { Fragment } from 'react';

import SortableCallColumn from 'in-analyze/components/RawCalls/SortableCallColumn';
import { Table, Thead, Tbody, Tr } from 'in-components/tables/sharedComponents';
import { LoadMoreRow } from 'in-components/tables/sharedComponents';
import Groups from 'in-analyze/components/GroupedCalls/Groups';

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
              noWrap
            />
            <SortableCallColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="ASC"
              technicalName="callsAgg"
              label="Calls"
              noWrap
            />
            <SortableCallColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="firstTimestamp"
              label="Earliest Timestamp"
              noWrap
            />
            <SortableCallColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="latencyAgg"
              label="Avg. Latency"
              noWrap
            />
            <SortableCallColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="errorsAgg"
              label="Error Rate"
              noWrap
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
