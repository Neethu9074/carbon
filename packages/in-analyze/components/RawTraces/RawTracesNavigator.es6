import { compose } from 'recompose';
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
import SortableCallColumn from 'in-analyze/components/SortableCallColumn';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { formatDateTime } from 'in-services/formatters/date';
import { millis } from 'in-services/formatters/number';

export default compose(getResponsiveNavigatorMode)(RawTracesNavigator);

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
      render={() => (
        <Table tableInCard>
          <Thead>
            <Tr size="compact">
              <ErroneousRowTh />
              <Th>Trace</Th>

              {showAllColumns && (
                <SortableCallColumn
                  orderBy={orderBy}
                  orderDirection={orderDirection}
                  onChangeOrder={onChangeOrder}
                  defaultDirection="DESC"
                  technicalName="timestamp"
                  label="Timestamp"
                />
              )}

              {showAllColumns && (
                <SortableCallColumn
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

                <Td active={item.trace.id === selectedTraceId}>
                  <Link href$={getLinkToTraceDetail(item.trace.id)}>{item.trace.label}</Link>
                  {!showAllColumns && (
                    <NavigatorMinifiedExtraData
                      extras={[formatDateTime(item.trace.startTime), millis.fixedCompact(item.trace.duration)]}
                    />
                  )}
                </Td>

                {showAllColumns && <Td>{formatDateTime(item.trace.startTime)}</Td>}

                {showAllColumns && (
                  <Td>
                    <span>{millis.fixedCompact(item.trace.duration)}</span>
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
