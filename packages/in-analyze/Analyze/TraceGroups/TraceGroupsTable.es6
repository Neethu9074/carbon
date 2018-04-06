import React from 'react';

import { Table, Thead, Tbody, Tr, SortableTh } from 'in-components/tables/sharedComponents';
import Groups from 'in-analyze/Analyze/TraceGroups/Groups';

export default function TraceGroupsTable({ orderBy, orderDirection, onChangeOrder, filter }) {
  return (
    <Table>
      <Thead>
        <Tr>
          <RawTracesSortableColumn
            orderBy={orderBy}
            orderDirection={orderDirection}
            onChangeOrder={onChangeOrder}
            defaultDirection="ASC"
            technicalName="label"
            label="Name"
          />
          <RawTracesSortableColumn
            orderBy={orderBy}
            orderDirection={orderDirection}
            onChangeOrder={onChangeOrder}
            defaultDirection="DESC"
            technicalName="calls"
            label="Traces"
          />
          <RawTracesSortableColumn
            orderBy={orderBy}
            orderDirection={orderDirection}
            onChangeOrder={onChangeOrder}
            defaultDirection="DESC"
            technicalName="duration"
            label="Latency"
          />
          <RawTracesSortableColumn
            orderBy={orderBy}
            orderDirection={orderDirection}
            onChangeOrder={onChangeOrder}
            defaultDirection="DESC"
            technicalName="errors"
            label="Erroneous calls"
          />
        </Tr>
      </Thead>
      <Tbody>
        <Groups orderBy={orderBy} orderDirection={orderDirection} filter={filter} depth={1} hasCharts />
      </Tbody>
    </Table>
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
