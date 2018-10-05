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
  Link
} from 'in-components/tables/sharedComponents';
import {
  getResponsiveNavigatorMode,
  showAllColumns as showAllColumnsKey
} from 'in-analyze/components/getResponsiveNavigatorMode';
import HeightRestrictedView from 'in-components/HeightRestrictedView/HeightRestrictedView';
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

  return (
    <HeightRestrictedView
      render={() => (
        <Table tableInCard>
          <Thead>
            <Tr size="compact">
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

              {showAllColumns && <Th>Latency</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {items.map(item => (
              <Tr key={item.trace.id} size="compact" active={item.trace.id === selectedTraceId}>
                <Td active={item.trace.id === selectedTraceId}>
                  <Link href$={getLinkToTraceDetail(item.trace.id)}>{item.trace.label}</Link>
                </Td>

                {showAllColumns && <Td>{formatDateTime(item.trace.startTime)}</Td>}

                {showAllColumns && (
                  <Td>
                    <span>{millis.fixedCompact(item.trace.duration)}</span>
                  </Td>
                )}
              </Tr>
            ))}

            <HorizontalIndicatorRow cols={showAllColumns ? 3 : 1} progress={progress} />
            <ErrorRows cols={showAllColumns ? 3 : 1} errors={errors} size="compact" />
            {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={showAllColumns ? 3 : 1} />}
            {canLoadMore && <LoadMoreRow loadMore={loadMore} size="compact" cols={showAllColumns ? 3 : 1} />}
          </Tbody>
        </Table>
      )}
    />
  );
}
