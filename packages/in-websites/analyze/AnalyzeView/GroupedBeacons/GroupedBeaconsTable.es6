import React, { Fragment } from 'react';

import { LoadMoreRow, Table, Thead, Tbody, Tr } from 'in-components/tables/sharedComponents';
import MetricColumnHeaders from 'in-analyze/components/MetricColumn/MetricColumnHeaders';
import Group from 'in-websites/analyze/AnalyzeView/GroupedBeacons/Group';
import SortableColumn from 'in-analyze/components/SortableColumn';
import Groups from 'in-websites/analyze/AnalyzeView/Groups';

export default function GroupedBeaconsTable(props) {
  const { orderBy, orderDirection, onChangeOrder, loadMore, canLoadMore, metrics } = props;
  const columnCount = 3 + metrics.length;
  return (
    <Fragment>
      <Table>
        <Thead>
          <Tr size="compact">
            <SortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="ASC"
              technicalName="name"
              label="Group"
              noWrap
            />
            <SortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="beaconCount_SUM_Agg"
              label="Count"
              noWrap
            />
            <SortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="earliestTimestamp"
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
