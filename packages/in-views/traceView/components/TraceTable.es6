import React from 'react';

import { furtherDataAvailable$, traces$, isLoading$, loadMoreTraces } from 'in-views/traceView/stores/traceList';
import EntityColumnContent from 'in-views/traceView/components/EntityColumnContent';
import { setSelectedTraceId, clearTraceSelection } from 'in-stores/traces';
import { sortDirection$ } from 'in-views/traceView/stores/sortDirection';
import { setSortBy, sortBy$ } from 'in-views/traceView/stores/sortBy';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getServiceSideForOverview } from 'in-sdk/tracing';
import { selectedTraceId } from 'in-stores/traces';
import LazyTable from 'in-components/LazyTable';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './TraceTable.less';

const block = 'in-trace-table';

const cols = [
  {
    title: '',
    field: 'ec',
    width: 35,
    nowrap: true,
    getContent(row) {
      return row.rawTrace.raw.get('errorCount') > 0 ? (
        <Tooltip content="Erroneous root span" align={'bottomLeft'}>
          <SvgIcon className={`${block}__error-icon`} type="error" height={12} color="#40535b" />
        </Tooltip>
      ) : null;
    }
  },
  {
    title: 'Timestamp',
    field: 'ts',
    width: 130,
    getContent(row) {
      return row.rawTrace.start;
    }
  },
  {
    title: 'Call',
    getContent(row) {
      return <div className={`${block}__call`}>{row.rawTrace.name}</div>;
    }
  },
  {
    title: 'Duration',
    field: 'd',
    width: 85,
    getContent(row) {
      return row.rawTrace.duration;
    }
  },
  {
    title: '#Errors',
    field: 'total_error_count',
    width: 80,
    getContent(row) {
      return row.rawTrace.totalErrorCount;
    }
  },
  {
    title: 'Service',
    getContent(row) {
      const side = getServiceSideForOverview(row.rawTrace.raw);
      const serviceSnapshotId = row.rawTrace[`${side}ServiceId`];
      return serviceSnapshotId ? (
        <EntityColumnContent
          serviceSnapshotId={serviceSnapshotId}
          time={row.rawTrace.startMillis}
          getLabelCallback={label =>
            getServiceLabelWithEndpoint(label, row.rawTrace.raw.get('destinationEndpointLabel'))
          }
        />
      ) : null;
    }
  }
];

export default connectTo(
  {
    isInfiniteLoading: isLoading$,
    selectedTraceId,
    traces: traces$
  },
  function TraceTable({ traces, selectedTraceId, isInfiniteLoading }) {
    if (!traces) {
      return <LoadingIndicator type="dark" />;
    }

    if (!isInfiniteLoading && traces.length === 0) {
      return (
        <div className={block}>
          <p className={`${block}__no-traces`}>There are no traces in the selected time window.</p>
        </div>
      );
    }

    const rows = traces.map(rawTrace => {
      return {
        key: rawTrace.id,
        rawTrace,
        isSelected: selectedTraceId === rawTrace.id
      };
    });

    return (
      <LazyTable
        cols={cols}
        rows={rows}
        loadMoreData={loadMoreTraces}
        sortBy$={sortBy$}
        sortDirection$={sortDirection$}
        furtherDataAvailable$={furtherDataAvailable$}
        isLoading$={isLoading$}
        onSortingChanged={setSortBy}
        onRowClicked={row => (row.key === selectedTraceId ? clearTraceSelection() : setSelectedTraceId(row.key))}
      />
    );
  }
);

function getServiceLabelWithEndpoint(serviceLabel, endpointLabel) {
  if (endpointLabel) {
    serviceLabel = `${serviceLabel} : ${endpointLabel}`;
  }

  return <div className={`${block}__service`}>{serviceLabel}</div>;
}
