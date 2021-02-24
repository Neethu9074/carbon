/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  LoadMoreRow,
  Link,
  ErroneousRowTh,
  ErroneousRowTd
} from 'in-components/tables/sharedComponents';
import ApplicationRawMetricsChart from 'in-analyze/components/MetricsChart/ApplicationRawMetricsChart';
import GroupingTableHeader from 'in-analyze/components/GroupingTableHeader';
import LoadingStates from 'in-analyze/AnalyzeView/components/LoadingStates';
import TableLinkWithIcon from 'in-analyze/components/TableLinkWithIcon';
import BatchingIndicator from 'in-analyze/components/BatchingIndicator';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import AnalyzeWorkspace from 'in-analyze/components/AnalyzeWorkspace';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import SortableColumn from 'in-analyze/components/SortableColumn';
import TimestampCell from 'in-analyze/components/TimestampCell';
import { latencyFixed } from 'in-services/formatters/number';
import { callClickedTracker } from 'in-analyze/tracker';
import SetBodyColor from 'in-components/SetBodyColor';

export default function RawCallsPresenter(props) {
  const {
    items,
    totalHits,
    totalRepresentedItemCount,
    errors,
    progress,
    loadMore,
    canLoadMore,
    orderBy,
    orderDirection,
    onChangeOrder,
    onShowGraphChange,
    showGraph
  } = props;

  return (
    <AnalyzeWorkspace {...props} title={t('in-analyze:rawCalls.callAnalytics')}>
      <GroupingTableHeader
        itemType="Call"
        nbRows={totalHits}
        nbItems={totalRepresentedItemCount}
        {...props}
        forAnalyzeCalls
        onChange={e => onShowGraphChange(e['showGraph'])}
      />
      {showGraph && <ApplicationRawMetricsChart {...props} />}
      <Table tableInCard>
        <Thead>
          <Tr size="compact">
            <ErroneousRowTh />

            <Th>Call</Th>

            <Th>Service</Th>

            <SortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="timestamp"
              label={t('in-analyze:rawCalls.labelTimestamp')}
            />

            <SortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="latency"
              label={t('in-analyze:rawCalls.labelLatency')}
            />
          </Tr>
        </Thead>
        <Tbody>
          {items.map(item => (
            <Tr key={item.call.id} size="compact">
              <ErroneousRowTd isErroneous={item.call.errorCount > 0} />
              <Td>
                <Link
                  href$={getLinkToTraceDetail(item.call.traceId, {
                    callId: item.call.id
                  })}
                  onClick={() => callClickedTracker()}
                >
                  {item.call.label}
                  <BatchingIndicator
                    batchCount={item.call.batchCount}
                    tooltipContent={t('in-analyze:rawCalls.tooltipBatched', {batchCount: item.call.batchCount})}
                  />
                </Link>
              </Td>

              <Td>
                <TableLinkWithIcon href$={getServiceDashboard(item.call.service.id)} icon="lib_application_service">
                  {item.call.service.label}
                </TableLinkWithIcon>
              </Td>

              <Td>
                <TimestampCell time={item.call.started} />
              </Td>

              <Td>
                {latencyFixed.compact(item.call.duration)}
                <BatchingIndicator
                  batchCount={item.call.batchCount}
                  tooltipContent={t('in-analyze:rawCalls.tooltipLatency', {batchCount: item.call.batchCount})}
                />
              </Td>
            </Tr>
          ))}

          {canLoadMore && <LoadMoreRow loadMore={loadMore} size="compact" cols={5} />}
        </Tbody>
      </Table>
      <LoadingStates progress={progress} errors={errors} />
      <SetBodyColor color="#fff" />
    </AnalyzeWorkspace>
  );
}
