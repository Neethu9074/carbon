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
  Link
} from 'in-components/tables/sharedComponents';
import HeightRestrictedView from 'in-components/HeightRestrictedView/HeightRestrictedView';
import { traceId as traceIdMatrixParameter } from 'in-analyze/navigation/matrix';
import { getLinkToTraceDetail, traceDetail } from 'in-analyze/navigation/paths';
import SortableCallColumn from 'in-analyze/components/SortableCallColumn';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { formatDateTime } from 'in-services/formatters/date';
import { millis } from 'in-services/formatters/number';

export default function RawTracesNavigator({
  items,
  errors,
  progress,
  loadMore,
  canLoadMore,
  orderBy,
  orderDirection,
  onChangeOrder,
  location
}) {
  const selectedTraceId = getMatrixParameter(location, traceDetail, traceIdMatrixParameter);
  return (
    <HeightRestrictedView
      render={() => (
        <Table tableInCard>
          <Thead>
            <Tr size="compact">
              <Th>Trace</Th>

              <SortableCallColumn
                orderBy={orderBy}
                orderDirection={orderDirection}
                onChangeOrder={onChangeOrder}
                defaultDirection="DESC"
                technicalName="timestamp"
                label="Timestamp"
              />

              <Th>Latency</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map(item => (
              <Tr key={item.trace.id} size="compact" active={item.trace.id === selectedTraceId}>
                <Td>
                  <Link href$={getLinkToTraceDetail(item.trace.id)}>{item.trace.label}</Link>
                </Td>

                <Td>{formatDateTime(item.trace.startTime)}</Td>

                <Td>
                  <span>{millis.fixedCompact(item.trace.duration)}</span>
                </Td>
              </Tr>
            ))}

            <HorizontalIndicatorRow cols={3} progress={progress} />
            <ErrorRows cols={3} errors={errors} size="compact" />
            {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={3} />}
            {canLoadMore && <LoadMoreRow loadMore={loadMore} size="compact" cols={3} />}
          </Tbody>
        </Table>
      )}
    />
  );
}
