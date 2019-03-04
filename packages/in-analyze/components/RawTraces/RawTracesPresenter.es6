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
import SortableColumn from 'in-analyze/components/SortableColumn';
import TableLinkWithIcon from 'in-analyze/components/TableLinkWithIcon';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import { clickTraceTracker } from 'in-analyze/components/tracker';
import TimestampCell from 'in-analyze/components/TimestampCell';
import ResultHeader from 'in-analyze/components/ResultHeader';
import { Th } from 'in-components/tables/sharedComponents';
import { latencyFixed } from 'in-services/formatters/number';

import locals from './RawTracesPresenter.mless';

export default function RawTracesPresenter(props) {
  const {
    items,
    totalHits,
    totalRepresentedItemCount,
    errors,
    progress,
    loadMore,
    canLoadMore,
    orderBy,
    orderDirection,
    onChangeOrder
  } = props;

  return (
    <AnalyzeTracesWorkspace {...props}>
      <ResultHeader itemType="Trace" nbRows={totalHits} nbItems={totalRepresentedItemCount} />
      <Table className={locals.table} tableInCard>
        <Thead>
          <Tr size="compact">
            <ErroneousRowTh />
            <Th>Trace</Th>
            <Th>Service</Th>

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
            <Tr key={item.trace.id} size="compact">
              <ErroneousRowTd isErroneous={item.trace.erroneous} />
              <Td>
                <Link href$={getLinkToTraceDetail(item.trace.id)} onClick={() => clickTraceTracker()}>
                  {item.trace.label}
                </Link>
              </Td>

              <Td>
                <TableLinkWithIcon href$={getServiceDashboard(item.trace.service.id)} icon="lib_application_service">
                  {item.trace.service.label}
                </TableLinkWithIcon>
              </Td>

              <Td>
                <TimestampCell time={item.trace.startTime} />
              </Td>

              <Td>{latencyFixed.compact(item.trace.duration)}</Td>
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
