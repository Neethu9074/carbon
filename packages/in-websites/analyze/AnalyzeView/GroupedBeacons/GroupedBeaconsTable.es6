import React, { Fragment } from 'react';

import { LoadMoreRow, Table, Thead, Tbody, Tr } from 'in-components/tables/sharedComponents';
import SortableCallColumn from 'in-analyze/components/SortableCallColumn';
import Group from 'in-websites/analyze/AnalyzeView/GroupedBeacons/Group';
import Groups from 'in-websites/analyze/AnalyzeView/Groups';

export default function GroupedBeaconsTable(props) {
  const { orderBy, orderDirection, onChangeOrder, loadMore, canLoadMore } = props;
  return (
    <Fragment>
      <Table>
        <Thead>
          <Tr size="compact">
            <SortableCallColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="ASC"
              technicalName="name"
              label="Group"
              noWrap
            />
            <SortableCallColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="ASC"
              technicalName="beaconCountAgg"
              label="Count"
              noWrap
            />
            <SortableCallColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="earliestTimestamp"
              label="Earliest Timestamp"
              noWrap
            />
            <SortableCallColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="beaconDurationAgg"
              label="Mean Duration"
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
