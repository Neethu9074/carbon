import React from 'react';

import { selectedTraces$, toggleIncludeInAnalytics } from 'in-stores/traces/analytics';
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
const removeTraceElement = `${block}__remove-trace`;

const cols = [
  {
    title: 'Call',
    type: 'string',
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
      width: '70px'
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
      width: '70px'
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
      width: '40px'
    },
    typeArgs: {
      get(row) {
        return {
          value: 0,
          content: (
            <div>
              <Link href$={getTraceViewLinkShowingTrace(row.traceId)} className={viewTraceLinkElement}>
                <SvgIcon type="arrow_right" width={14} className={viewTraceElement} />
              </Link>

              <SvgIcon
                type="x"
                width={10}
                className={removeTraceElement}
                onClick={() => toggleIncludeInAnalytics(row.trace)}
              />
            </div>
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
    selectedTraces: selectedTraces$
  },
  function SelectedTraces({ selectedTraces }) {
    const rows = Object.keys(selectedTraces).map(traceId => {
      return {
        key: traceId,
        traceId,
        trace: selectedTraces[traceId]
      };
    });

    return (
      <div className={block}>
        <Table maxItemsPerPage={Number.MAX_VALUE} cols={cols} rows={rows} />
      </div>
    );
  }
);
