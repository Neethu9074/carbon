import React, { Fragment } from 'react';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  HorizontalIndicatorRow,
  LoadingSkeletonRows,
  ErrorRows,
  LoadMoreRow,
  ErroneousRowTh,
  ErroneousRowTd
} from 'in-components/tables/sharedComponents';
import { traceId as traceIdMatrixParameter, callId as callIdMatrixParameter } from 'in-analyze/navigation/matrix';
import HeightRestrictedView from 'in-components/layout/HeightRestrictedView/HeightRestrictedView';
import ListItemPresenter from 'in-analyze/components/RawTraces/ListItemPresenter';
import { getLinkToTraceDetail, traceDetail } from 'in-analyze/navigation/paths';
import SortableColumn from 'in-analyze/components/SortableColumn';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { callClickedTracker } from 'in-analyze/tracker';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-new-components/Pill';

export default function RawCallsNavigator({
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
  const selectedCallId = getMatrixParameter(location, traceDetail, callIdMatrixParameter);

  return (
    <HeightRestrictedView
      render={() => (
        <Table tableInCard>
          <Thead>
            <Tr size="compact">
              <ErroneousRowTh />

              <SortableColumn
                orderBy={orderBy}
                orderDirection={orderDirection}
                onChangeOrder={onChangeOrder}
                defaultDirection="DESC"
                technicalName="timestamp"
                label="Timestamp"
              />

              <SortableColumn
                rightAligned
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
              <Tr
                key={item.call.id}
                size="compact"
                active={item.call.traceId === selectedTraceId && item.call.id === selectedCallId}
              >
                <ErroneousRowTd isErroneous={item.call.errorCount > 0} />
                <Td active={item.call.traceId === selectedTraceId && item.call.id === selectedCallId} colSpan={3}>
                  <ListItemPresenter
                    item={item}
                    active={item.call.traceId === selectedTraceId && item.call.id === selectedCallId}
                    label={
                      <>
                        {item.call.label}
                        {item.call.batchCount > 1 && (
                          <Fragment>
                            {' '}
                            <Tooltip
                              themeStyle="light"
                              content={`This call is batched and represents ${item.call.batchCount} individual calls.`}
                            >
                              <Pill kind="lighter">{item.call.batchCount}</Pill>
                            </Tooltip>
                          </Fragment>
                        )}
                      </>
                    }
                    href$={getLinkToTraceDetail(item.call.traceId, { callId: item.call.id })}
                    onClick={() => callClickedTracker()}
                    time={item.call.started}
                    duration={item.call.duration}
                  />
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
