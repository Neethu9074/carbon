import React from 'react';

import { Table, Thead, Tbody, Tr, SortableTh } from 'in-components/tables/sharedComponents';
import Groups from 'in-analyze/GroupedTraces/TraceGroups/Groups';

export default function TraceGroupsTable(props) {
  const { orderBy, orderDirection, onChangeOrder } = props;
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
            label="Calls"
          />
          <RawTracesSortableColumn
            orderBy={orderBy}
            orderDirection={orderDirection}
            onChangeOrder={onChangeOrder}
            defaultDirection="DESC"
            technicalName="duration"
            label="Avg. Latency"
          />
          <RawTracesSortableColumn
            orderBy={orderBy}
            orderDirection={orderDirection}
            onChangeOrder={onChangeOrder}
            defaultDirection="DESC"
            technicalName="errors"
            label="Errors"
          />
        </Tr>
      </Thead>
      <Tbody>
        <Groups {...props} />
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
