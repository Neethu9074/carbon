import React, { Fragment } from 'react';

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
import ItemsInGroupsIndicator from 'in-analyze/components/ItemsInGroupsIndicator';
import AnalyzeCallsWorkspace from 'in-analyze/components/AnalyzeCallsWorkspace';
import SortableCallColumn from 'in-analyze/components/SortableCallColumn';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import { formatDateTime } from 'in-services/formatters/date';
import { millis } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-new-components/Pill';

import locals from './RawCallsPresenter.mless';

export default function RawCalls(props) {
  const { items, totalHits, errors, progress, loadMore, canLoadMore, orderBy, orderDirection, onChangeOrder } = props;

  return (
    <AnalyzeCallsWorkspace {...props}>
      <ItemsInGroupsIndicator numCalls={totalHits} />
      <Table className={locals.table} tableInCard>
        <Thead>
          <Tr size="compact">
            <ErroneousRowTh />

            <Th>Call</Th>

            <Th>Service</Th>

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
              <ErroneousRowTd isErroneous={item.call.errorCount > 0} />
              <Td>
                <Link href$={getLinkToTraceDetail(item.call.traceId, { callId: item.call.id })}>
                  {item.call.label}
                  {item.call.batchCount > 1 && (
                    <Fragment>
                      {' '}
                      <Tooltip
                        themeStyle="light"
                        content={`This call is batched and represents ${item.call.batchCount} individual calls.`}
                      >
                        <Pill className={locals.batchSizeIndicator} kind="lighter">
                          {item.call.batchCount}
                        </Pill>
                      </Tooltip>
                    </Fragment>
                  )}
                </Link>
              </Td>

              <Td>
                <div className={locals.cell}>
                  <SvgIcon className={locals.serviceIcon} type="lib_application_service" width={24} height={24} />
                  <Link className={locals.serviceLink} href$={getServiceDashboard(item.call.service.id)}>
                    {item.call.service.label}
                  </Link>
                </div>
              </Td>

              <Td>
                <div className={locals.cell}>
                  <SvgIcon className={locals.timeIcon} type="lib_datetime_time" width={16} height={16} />
                  {formatDateTime(item.call.started)}
                </div>
              </Td>

              <Td>
                <span className={locals.metricValue}>{millis.fixedCompact(item.call.duration)}</span>
              </Td>
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
