/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
  ErroneousRowTh,
  ErroneousRowTd
} from 'in-components/tables/sharedComponents';
import HeightRestrictedView from 'in-components/layout/HeightRestrictedView/HeightRestrictedView';
import { traceId as traceIdMatrixParameter } from 'in-analyze/navigation/matrix';
import ListItemPresenter from 'in-analyze/components/RawTraces/ListItemPresenter';
import { getLinkToTraceDetail, traceDetail } from 'in-analyze/navigation/paths';
import SortableColumn from 'in-analyze/components/SortableColumn';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { traceClickedTracker } from 'in-analyze/tracker';

export default function RawTracesNavigator({
  items,
  errors,
  progress,
  orderBy,
  orderDirection,
  onChangeOrder,
  loadMore,
  canLoadMore,
  location
}) {
  const selectedTraceId = getMatrixParameter(location, traceDetail, traceIdMatrixParameter);

  return (
    <HeightRestrictedView
      render={() => (
        <Table tableInCard>
          <Thead>
            <Tr size="compact">
              <ErroneousRowTh />
              <Th>Trace</Th>
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
              <Tr key={item.trace.id} size="compact" active={item.trace.id === selectedTraceId}>
                <ErroneousRowTd isErroneous={item.trace.erroneous} />

                <Td active={item.trace.id === selectedTraceId} colSpan={3}>
                  <ListItemPresenter
                    item={item}
                    active={item.trace.id === selectedTraceId}
                    label={item.trace.label}
                    href$={getLinkToTraceDetail(item.trace.id)}
                    onClick={() =>
                      traceClickedTracker({ erroneous: item.trace.erroneous, latecy: item.trace.duration })
                    }
                    time={item.trace.startTime}
                    duration={item.trace.duration}
                  />
                </Td>
              </Tr>
            ))}

            <HorizontalIndicatorRow cols={4} progress={progress} />
            <ErrorRows cols={4} errors={errors} size="compact" />
            {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={4} />}
            {canLoadMore && <LoadMoreRow loadMore={loadMore} size="compact" cols={4} />}
          </Tbody>
        </Table>
      )}
    />
  );
}
