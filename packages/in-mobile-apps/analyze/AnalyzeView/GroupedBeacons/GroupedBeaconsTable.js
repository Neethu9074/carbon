/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import {
  timestampMetricName,
  groupNameMetricName,
  groupCountMetricName
} from 'in-mobile-apps/analyze/AnalyzeView/metrics';
import { LoadMoreRow, Table, Thead, Tbody, Tr } from 'in-components/tables/sharedComponents';
import MetricColumnHeaders from 'in-analyze/components/MetricColumn/MetricColumnHeaders';
import Group from 'in-mobile-apps/analyze/AnalyzeView/GroupedBeacons/Group';
import SortableColumn from 'in-analyze/components/SortableColumn';
import Groups from 'in-mobile-apps/analyze/AnalyzeView/Groups';
import { t } from 'in-i18n';

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
              technicalName={groupNameMetricName}
              label={t('in-mobile-apps:analyzeView.groupedBeaconsTable.groupLabel')}
              noWrap
            />
            <SortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName={groupCountMetricName}
              label={t('in-mobile-apps:analyzeView.groupedBeaconsTable.countLabel')}
              noWrap
            />
            <SortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName={timestampMetricName}
              label={t('in-mobile-apps:analyzeView.groupedBeaconsTable.timestampLabel')}
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
