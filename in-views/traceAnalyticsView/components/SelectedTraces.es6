import React from 'react';

import { clear, markedTraces$, markTrace, clearTraceId } from 'in-stores/traces/analytics/markedTraces';
import { analysedTraces$ } from 'in-stores/traces/analytics/analysedTraces';
import { getTraceViewLinkShowingTrace } from 'in-stores/navigation/view';
import { millis, number } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link/Link';
import { getLabel } from 'in-sdk/tracing';
import connectTo from 'in-hoc/connectTo';
import Table from 'in-components/Table';

import './SelectedTraces.less';

const block = 'in-trace-analytics-selected-traces';
const viewTraceElement = `${block}__view-trace`;
const viewTraceLinkElement = `${block}__view-trace-link`;

const cols = [
  {
    title: 'Call',
    type: 'string',
    cellStyle: {
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      maxWidth: '210px'
    },
    typeArgs: {
      getValue(row) {
        return getLabel(row.trace);
      }
    }
  },
  {
    title: 'Duration',
    type: 'number',
    cellStyle: {
      width: '70px',
      minWidth: '70px'
    },
    typeArgs: {
      getValue(row) {
        return row.trace.get('duration');
      },
      getContent: millis.compact
    }
  },
  {
    title: '#Errors',
    type: 'number',
    cellStyle: {
      width: '70px',
      minWidth: '70px'
    },
    typeArgs: {
      getValue(row) {
        return row.trace.get('totalErrorCount');
      },
      getContent: number.compact
    }
  },
  {
    title: '',
    type: 'custom',
    disableSorting: true,
    cellStyle: {
      width: '20px',
      minWidth: '20px'
    },
    typeArgs: {
      get(row) {
        return {
          value: 0,
          content: (
            <Link href$={getTraceViewLinkShowingTrace(row.traceId)} className={viewTraceLinkElement}>
              <SvgIcon type="arrow_right" width={14} className={viewTraceElement} />
            </Link>
          )
        };
      },
      comparator() {
        return 0;
      }
    }
  }
];

export default connectTo(
  {
    analysedTraces: analysedTraces$,
    markedTraces: markedTraces$
  },
  function SelectedTraces({ analysedTraces, markedTraces }) {
    const rows = [];
    const selectedSnapshotIds = [];
    analysedTraces.forEach((trace, traceId) => {
      if (markedTraces.has(traceId)) {
        selectedSnapshotIds.push(traceId);
      }
      rows.push({
        key: traceId,
        traceId,
        trace
      });
    });

    return (
      <div className={block}>
        <Table
          maxItemsPerPage={Number.MAX_VALUE}
          cols={cols}
          rows={rows}
          selectedRowKeys={selectedSnapshotIds}
          noDataText="Select traces to start analytics."
          onRowClick={(row, e) => onRowClick(e, row, markedTraces)}
        />
      </div>
    );
  }
);

function onRowClick(e, row, markedTraces) {
  const traceId = row.traceId;
  const trace = row.trace;
  const isMarked = markedTraces.has(traceId);

  if (!e.metaKey) {
    clear();
  }

  if (!isMarked) {
    markTrace(traceId, trace);
  } else {
    clearTraceId(traceId);
  }
}
