import React from 'react';

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
  Link
} from 'in-components/tables/sharedComponents';
import HeightRestrictedView from 'in-components/HeightRestrictedView/HeightRestrictedView';
import SortableCallColumn from 'in-analyze/components/SortableCallColumn';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import { formatDateTime } from 'in-services/formatters/date';
import { millis } from 'in-services/formatters/number';
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
  onChangeOrder
}) {
  return (
    <HeightRestrictedView
      render={() => (
        <Table tableInCard>
          <Thead>
            <Tr size="compact">
              <SortableCallColumn
                orderBy={orderBy}
                orderDirection={orderDirection}
                onChangeOrder={onChangeOrder}
                defaultDirection="ASC"
                technicalName="callName"
                label="Call"
              />

              <SortableCallColumn
                orderBy={orderBy}
                orderDirection={orderDirection}
                onChangeOrder={onChangeOrder}
                defaultDirection="DESC"
                technicalName="timestamp"
                label="Timestamp"
              />

              <SortableCallColumn
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
                <Td>
                  <Link href$={getLinkToTraceDetail(item.call.traceId, { callId: item.call.id })}>
                    {item.call.label}
                    {item.call.batchCount > 1 && (
                      <Tooltip
                        themeStyle="light"
                        content={`This call is batched and represents ${item.call.batchCount} individual calls.`}
                      >
                        <Pill kind="lighter">{item.call.batchCount}</Pill>
                      </Tooltip>
                    )}
                  </Link>
                </Td>

                <Td>{formatDateTime(item.call.started)}</Td>

                <Td>
                  <span>{millis.fixedCompact(item.call.duration)}</span>
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
