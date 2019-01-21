import React, { Fragment } from 'react';

import { LoadMoreRow, Table, Thead, Tbody, Tr } from 'in-components/tables/sharedComponents';
import MetricColumnHeaders from 'in-analyze/components/MetricColumn/MetricColumnHeaders';
import SortableColumn from 'in-analyze/components/SortableColumn';
import Groups from 'in-analyze/components/GroupedTraces/Groups';
import Group from 'in-analyze/components/GroupedTraces/Group';

import locals from './TraceGroupsTable.mless';

export default function TraceGroupsTable(props) {
  const { dataSource, orderBy, orderDirection, onChangeOrder, loadMore, canLoadMore, metrics } = props;
  const columnCount = 3 + metrics.length;

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
              defaultDirection="DESC"
              technicalName={`${dataSource}_SUM_Agg`}
              label="Count"
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

            <MetricColumnHeaders {...props} />
          </Tr>
        </Thead>
        <Tbody>
          <Groups {...props} columnCount={columnCount} groupComponent={Group} />
          {canLoadMore && <LoadMoreRow loadMore={loadMore} cols={columnCount} size="compact" />}
        </Tbody>
      </Table>
    </Fragment>
  );
}
