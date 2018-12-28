import React, { Fragment } from 'react';
import { find } from 'lodash';

import { LoadMoreRow, Table, Thead, Tbody, Tr } from 'in-components/tables/sharedComponents';
import Group from 'in-websites/analyze/AnalyzeView/GroupedBeacons/Group';
import SortableColumn from 'in-analyze/components/SortableColumn';
import { aggregationLabels } from 'in-stores/metric/metric';
import Groups from 'in-websites/analyze/AnalyzeView/Groups';

export default function GroupedBeaconsTable(props) {
  const { orderBy, orderDirection, onChangeOrder, loadMore, canLoadMore, metrics, availableMetrics } = props;
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

            {metrics.map(({ metric, aggregation }) => {
              let label = `${metric} (${aggregation})`;
              const metricDefinition = find(availableMetrics, m => m.metric === metric);
              if (metricDefinition) {
                label = metricDefinition.label;

                if (metricDefinition.supportedAggregations.length > 1) {
                  label += ` (${aggregationLabels[aggregation]})`;
                }
              }

              return (
                <SortableColumn
                  key={`${metric}_${aggregation}`}
                  orderBy={orderBy}
                  orderDirection={orderDirection}
                  onChangeOrder={onChangeOrder}
                  defaultDirection="DESC"
                  technicalName={`${metric}_${aggregation}_Agg`}
                  label={label}
                  noWrap
                />
              );
            })}
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
