import React, { Fragment } from 'react';
import { compose } from 'recompose';

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
import { traceId as traceIdMatrixParameter, callId as callIdMatrixParameter } from 'in-analyze/navigation/matrix';
import HeightRestrictedView from 'in-components/HeightRestrictedView/HeightRestrictedView';
import { getLinkToTraceDetail, traceDetail } from 'in-analyze/navigation/paths';
import SortableCallColumn from 'in-analyze/components/SortableCallColumn';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { formatDateTime } from 'in-services/formatters/date';
import { millis } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-new-components/Pill';

export default compose(getResponsiveNavigatorMode)(RawCallsNavigator);

function RawCallsNavigator({
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
  const selectedCallId = getMatrixParameter(location, traceDetail, callIdMatrixParameter);
  const showAllColumns = navigatorMode === showAllColumnsKey;
  const columnCount = showAllColumns ? 4 : 2;

  return (
    <HeightRestrictedView
      render={() => (
        <Table tableInCard>
          <Thead>
            <Tr size="compact">
              <ErroneousRowTh />
              <Th>Call</Th>

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
              <Tr
                key={item.call.id}
                size="compact"
                active={item.call.traceId === selectedTraceId && item.call.id === selectedCallId}
              >
                <ErroneousRowTd isErroneous={item.call.errorCount > 0} />
                <Td active={item.call.traceId === selectedTraceId && item.call.id === selectedCallId}>
                  <Link href$={getLinkToTraceDetail(item.call.traceId, { callId: item.call.id })}>
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
                  </Link>
                </Td>

                {showAllColumns && <Td>{formatDateTime(item.call.started)}</Td>}

                {showAllColumns && (
                  <Td>
                    <span>{millis.fixedCompact(item.call.duration)}</span>
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
