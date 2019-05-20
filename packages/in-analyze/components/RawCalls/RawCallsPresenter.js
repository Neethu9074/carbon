import React from 'react';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HorizontalIndicatorRow,
  LoadingSkeletonRows,
  ErrorRows,
  LoadMoreRow,
  Link,
  ErroneousRowTh,
  ErroneousRowTd
} from 'in-components/tables/sharedComponents';
import AnalyzeCallsWorkspace from 'in-analyze/components/AnalyzeCallsWorkspace';
import TableLinkWithIcon from 'in-analyze/components/TableLinkWithIcon';
import BatchingIndicator from 'in-analyze/components/BatchingIndicator';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import SortableColumn from 'in-analyze/components/SortableColumn';
import { clickCallTracker } from 'in-analyze/components/tracker';
import TimestampCell from 'in-analyze/components/TimestampCell';
import ResultHeader from 'in-analyze/components/ResultHeader';
import { latencyFixed } from 'in-services/formatters/number';

import locals from './RawCallsPresenter.mless';

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
    onChangeOrder
  } = props;

  return (
    <AnalyzeCallsWorkspace {...props}>
      <ResultHeader itemType="Call" nbRows={totalHits} nbItems={totalRepresentedItemCount} />
      <Table className={locals.table} tableInCard>
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
              label="Timestamp"
            />

            <SortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="latency"
              label="Latency"
            />
          </Tr>
        </Thead>
        <Tbody>
          {items.map(item => (
            <Tr key={item.call.id} size="compact">
              <ErroneousRowTd isErroneous={item.call.errorCount > 0} />
              <Td>
                <Link
                  href$={getLinkToTraceDetail(item.call.traceId, { callId: item.call.id })}
                  onClick={() => clickCallTracker()}
                >
                  {item.call.label}
                  <BatchingIndicator
                    batchCount={item.call.batchCount}
                    tooltipContent={`This call is batched and represents ${item.call.batchCount} individual calls.`}
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

              <Td>{latencyFixed.compact(item.call.duration)}</Td>
            </Tr>
          ))}

          <HorizontalIndicatorRow cols={5} progress={progress} />
          <ErrorRows cols={5} errors={errors} size="compact" />
          {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={5} />}
          {canLoadMore && <LoadMoreRow loadMore={loadMore} size="compact" cols={5} />}
        </Tbody>
      </Table>
    </AnalyzeCallsWorkspace>
  );
}
