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
import {
  getResponsiveNavigatorMode,
  showAllColumns as showAllColumnsKey
} from 'in-analyze/components/getResponsiveNavigatorMode';
import HeightRestrictedView from 'in-components/HeightRestrictedView/HeightRestrictedView';
import NavigatorMinifiedExtraData from 'in-analyze/components/NavigatorMinifiedExtraData';
import { traceId as traceIdMatrixParameter } from 'in-analyze/navigation/matrix';
import { getLinkToTraceDetail, traceDetail } from 'in-analyze/navigation/paths';
import SortableColumn from 'in-analyze/components/SortableColumn';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { formatDateTime } from 'in-services/formatters/date';
import { latencyFixed } from 'in-services/formatters/number';
import { traceClickedTracker } from 'in-analyze/tracker';

import locals from './RawTracesNavigator.mless';

export default getResponsiveNavigatorMode(RawTracesNavigator);

function RawTracesNavigator({
  items,
  errors,
  progress,
  loadMore,
  canLoadMore,
  orderBy,
  orderDirection,
  onChangeOrder,
  location,
  navigatorMode
}) {
  const selectedTraceId = getMatrixParameter(location, traceDetail, traceIdMatrixParameter);
  const showAllColumns = navigatorMode === showAllColumnsKey;
  const columnCount = showAllColumns ? 4 : 2;

  return (
    <HeightRestrictedView
      className={locals.navigator}
      render={() => (
        <Table tableInCard>
          <Thead>
            <Tr size="compact">
              <ErroneousRowTh />
              <Th>Trace</Th>

              {showAllColumns && (
                <SortableColumn
                  orderBy={orderBy}
                  orderDirection={orderDirection}
                  onChangeOrder={onChangeOrder}
                  defaultDirection="DESC"
                  technicalName="timestamp"
                  label="Timestamp"
                />
              )}

              {showAllColumns && (
                <SortableColumn
                  orderBy={orderBy}
                  orderDirection={orderDirection}
                  onChangeOrder={onChangeOrder}
                  defaultDirection="DESC"
                  technicalName="latency"
                  label="Latency"
                />
              )}
            </Tr>
          </Thead>
          <Tbody>
            {items.map(item => (
              <Tr key={item.trace.id} size="compact" active={item.trace.id === selectedTraceId}>
                <ErroneousRowTd isErroneous={item.trace.erroneous} />

                <Td className={locals.labelColumn} active={item.trace.id === selectedTraceId}>
                  <Link href$={getLinkToTraceDetail(item.trace.id)} onClick={() => traceClickedTracker()}>
                    {item.trace.label}
                  </Link>
                  {!showAllColumns && (
                    <NavigatorMinifiedExtraData
                      extras={[formatDateTime(item.trace.startTime), latencyFixed.compact(item.trace.duration)]}
                    />
                  )}
                </Td>

                {showAllColumns && <Td>{formatDateTime(item.trace.startTime)}</Td>}

                {showAllColumns && (
                  <Td>
                    <span>{latencyFixed.compact(item.trace.duration)}</span>
                  </Td>
                )}
              </Tr>
            ))}

            <HorizontalIndicatorRow cols={columnCount} progress={progress} />
            <ErrorRows cols={columnCount} errors={errors} size="compact" />
            {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={columnCount} />}
            {canLoadMore && <LoadMoreRow loadMore={loadMore} size="compact" cols={columnCount} />}
          </Tbody>
        </Table>
      )}
    />
  );
}
