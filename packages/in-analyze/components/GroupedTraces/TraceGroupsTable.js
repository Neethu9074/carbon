/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React, { Fragment } from 'react';

import { LoadMoreRow, Table, Thead, Tbody, Tr } from 'in-components/tables/sharedComponents';
import MetricColumnHeaders from 'in-analyze/components/MetricColumn/MetricColumnHeaders';
import LoadingStates from 'in-analyze/AnalyzeView/components/LoadingStates';
import SortableColumn from 'in-analyze/components/SortableColumn';
import Groups from 'in-analyze/components/GroupedTraces/Groups';
import Group from 'in-analyze/components/GroupedTraces/Group';

export default function TraceGroupsTable(props) {
  const { orderBy, orderDirection, onChangeOrder, loadMore, canLoadMore, metrics, progress, errors } = props;
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
              technicalName="group"
              label={t('in-analyze:groupedTraces.labelGroup')}
              noWrap
            />
            <SortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="count"
              label={t('in-analyze:groupedTraces.labelCount')}
              noWrap
            />
            <SortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="firstTimestamp"
              label={t('in-analyze:groupedTraces.labelEarliestTimestamp')}
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
      <LoadingStates progress={progress} errors={errors} />
    </Fragment>
  );
}
