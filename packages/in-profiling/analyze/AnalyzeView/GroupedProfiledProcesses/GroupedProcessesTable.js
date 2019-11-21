import React from 'react';

import { LoadMoreRow, Table, Thead, Tbody, Tr } from 'in-components/tables/sharedComponents';
import Groups from 'in-profiling/analyze/AnalyzeView/GroupedProfiledProcesses/Groups';
import SortableColumn from 'in-analyze/components/SortableColumn';

export default function GroupedProcessesTable(props) {
  const { orderBy, orderDirection, onChangeOrder, loadMore, canLoadMore } = props;
  const columnCount = 3;
  return (
    <Table>
      <Thead>
        <Tr size="compact">
          <SortableColumn
            orderBy={orderBy}
            orderDirection={orderDirection}
            onChangeOrder={onChangeOrder}
            defaultDirection="ASC"
            technicalName="groupName"
            label="Group"
            noWrap
          />
          <SortableColumn
            orderBy={orderBy}
            orderDirection={orderDirection}
            onChangeOrder={onChangeOrder}
            defaultDirection="DESC"
            technicalName="technology"
            label="Technology"
            noWrap
          />
          <SortableColumn
            orderBy={orderBy}
            orderDirection={orderDirection}
            onChangeOrder={onChangeOrder}
            defaultDirection="DESC"
            technicalName="processes"
            label="Number of Processes"
            noWrap
          />
        </Tr>
      </Thead>
      <Tbody>
        <Groups {...props} columnCount={columnCount} />
        {canLoadMore && <LoadMoreRow loadMore={loadMore} cols={columnCount} size="compact" />}
      </Tbody>
    </Table>
  );
}
