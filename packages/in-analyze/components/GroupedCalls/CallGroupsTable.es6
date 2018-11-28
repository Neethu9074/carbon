import React, { Fragment } from 'react';

import { LoadMoreRow, Table, Thead, Tbody, Tr } from 'in-components/tables/sharedComponents';
import SortableColumn from 'in-analyze/components/SortableColumn';
import Group from 'in-analyze/components/GroupedCalls/Group';
import Groups from 'in-analyze/components/Groups';

import locals from './CallGroupsTable.mless';

export default function CallGroupsTable(props) {
  const { orderBy, orderDirection, onChangeOrder, loadMore, canLoadMore } = props;
  return (
    <Fragment>
      <Table className={locals.table}>
        <Thead>
          <Tr size="compact">
            <SortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="ASC"
              technicalName="group"
              label="Group"
              noWrap
            />
            <SortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="ASC"
              technicalName="callsAgg"
              label="Calls"
              noWrap
            />
            <SortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="firstTimestamp"
              label="Earliest Timestamp"
              noWrap
            />
            <SortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="latencyAgg"
              label="Mean Latency"
              noWrap
            />
            <SortableColumn
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
          <Groups {...props} groupComponent={Group} />
          {canLoadMore && <LoadMoreRow loadMore={loadMore} cols={5} size="compact" />}
        </Tbody>
      </Table>
    </Fragment>
  );
}
