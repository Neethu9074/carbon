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
  Link,
  ErroneousRowTh,
  ErroneousRowTd
} from 'in-components/tables/sharedComponents';
import AnalyzeTracesWorkspace from 'in-analyze/components/AnalyzeTracesWorkspace';
import ItemsInGroupsIndicator from 'in-analyze/components/ItemsInGroupsIndicator';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import SortableCallColumn from 'in-analyze/components/SortableCallColumn';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import { Th } from 'in-components/tables/sharedComponents';
import { formatDateTime } from 'in-services/formatters/date';
import { millis } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';

import locals from './RawTracesPresenter.mless';

export default function RawTracesPresenter(props) {
  const { items, totalHits, errors, progress, loadMore, canLoadMore, orderBy, orderDirection, onChangeOrder } = props;

  return (
    <AnalyzeTracesWorkspace {...props}>
      <ItemsInGroupsIndicator numTraces={totalHits} />
      <Table className={locals.table} tableInCard>
        <Thead>
          <Tr size="compact">
            <ErroneousRowTh />
            <Th>Trace</Th>
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
            <Tr key={item.trace.id} size="compact">
              <ErroneousRowTd isErroneous={item.trace.erroneous} />
              <Td>
                <Link href$={getLinkToTraceDetail(item.trace.id)}>{item.trace.label}</Link>
              </Td>

              <Td>
                <div className={locals.cell}>
                  <SvgIcon className={locals.serviceIcon} type="lib_application_service" width={24} height={24} />
                  <Link className={locals.serviceLink} href$={getServiceDashboard(item.trace.service.id)}>
                    {item.trace.service.label}
                  </Link>
                </div>
              </Td>

              <Td>
                <div className={locals.cell}>
                  <SvgIcon className={locals.timeIcon} type="lib_datetime_time" width={16} height={16} />
                  {formatDateTime(item.trace.startTime)}
                </div>
              </Td>

              <Td>
                <span className={locals.metricValue}>{millis.fixedCompact(item.trace.duration)}</span>
              </Td>
            </Tr>
          ))}

          <HorizontalIndicatorRow cols={5} progress={progress} />
          <ErrorRows cols={5} errors={errors} size="compact" />
          {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={5} />}
          {canLoadMore && <LoadMoreRow loadMore={loadMore} size="compact" cols={5} />}
        </Tbody>
      </Table>
    </AnalyzeTracesWorkspace>
  );
}
