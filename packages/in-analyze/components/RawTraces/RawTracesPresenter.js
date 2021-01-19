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
  Td,
  LoadMoreRow,
  Link,
  ErroneousRowTh,
  ErroneousRowTd
} from 'in-components/tables/sharedComponents';
import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import ApplicationRawMetricsChart from 'in-analyze/components/MetricsChart/ApplicationRawMetricsChart';
import GroupingTableHeader from 'in-analyze/components/GroupingTableHeader';
import LoadingStates from 'in-analyze/AnalyzeView/components/LoadingStates';
import TableLinkWithIcon from 'in-analyze/components/TableLinkWithIcon';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import AnalyzeWorkspace from 'in-analyze/components/AnalyzeWorkspace';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import SortableColumn from 'in-analyze/components/SortableColumn';
import TimestampCell from 'in-analyze/components/TimestampCell';
import { latencyFixed } from 'in-services/formatters/number';
import { Th } from 'in-components/tables/sharedComponents';
import { traceClickedTracker } from 'in-analyze/tracker';
import SetBodyColor from 'in-components/SetBodyColor';
import connectTo from 'in-hoc/connectTo';

export default connectTo({ isInternalVisible: isInternalVisible$ }, function RawTracesPresenter(props) {
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
    onChangeOrder,
    onShowGraphChange,
    showGraph
  } = props;
  return (
    <AnalyzeWorkspace {...props} title="Trace Analytics">
      <GroupingTableHeader
        itemType="Trace"
        nbRows={totalHits}
        nbItems={totalRepresentedItemCount}
        {...props}
        forAnalyzeCalls
        onChange={e => onShowGraphChange(e['showGraph'])}
      />
      {showGraph && <ApplicationRawMetricsChart {...props} />}
      <Table tableInCard>
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
                <Link
                  href$={getLinkToTraceDetail(item.trace.id)}
                  onClick={() =>
                    traceClickedTracker({
                      erroneous: item.trace.erroneous,
                      latecy: item.trace.duration
                    })
                  }
                >
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
          {canLoadMore && <LoadMoreRow loadMore={loadMore} size="compact" cols={5} />}
        </Tbody>
      </Table>
      <LoadingStates progress={progress} errors={errors} />
      <SetBodyColor color="#fff" />
    </AnalyzeWorkspace>
  );
});
