import React, { Fragment } from 'react';

import { Table, Thead, Tbody, Tr, SortableTh } from 'in-components/tables/sharedComponents';
import { LoadMoreRow } from 'in-components/tables/sharedComponents';
import Groups from 'in-analyze/GroupedTraces/Groups';

import locals from './TraceGroupsTable.mless';

export default function TraceGroupsTable(props) {
  const { orderBy, orderDirection, onChangeOrder, loadMore, canLoadMore } = props;
  return (
    <Fragment>
      <Table className={locals.table}>
        <Thead>
          <Tr size="compact">
            <RawTracesSortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="ASC"
              technicalName="label"
              label="Trace Name"
            />
            <RawTracesSortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="calls"
              label="Calls"
            />
            <RawTracesSortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="duration"
              label="Avg. Duration"
            />
            <RawTracesSortableColumn
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
          {canLoadMore && <LoadMoreRow loadMore={loadMore} cols={4} size="compact" />}
        </Tbody>
      </Table>
    </Fragment>
  );
}

function RawTracesSortableColumn({ orderBy, orderDirection, defaultDirection, technicalName, label, onChangeOrder }) {
  return (
    <SortableTh
      isSortedByThisColumn={orderBy === technicalName}
      sortDirection={orderDirection}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        if (orderBy === technicalName) {
          onChangeOrder({
            orderBy: technicalName,
            orderDirection: orderDirection === 'ASC' ? 'DESC' : 'ASC'
          });
        } else {
          onChangeOrder({
            orderBy: technicalName,
            orderDirection: defaultDirection
          });
        }
      }}
    >
      {label}
    </SortableTh>
  );
}
