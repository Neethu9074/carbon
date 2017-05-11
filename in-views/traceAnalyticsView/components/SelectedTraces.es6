import React from 'react';

import { millis, number } from 'in-services/formatters/number';
import { selectedTraces$ } from 'in-stores/traces/analytics';
import { getLabel } from 'in-sdk/tracing';
import connectTo from 'in-hoc/connectTo';
import Table from 'in-components/Table';

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
    typeArgs: {
      getValue(row) {
        return row.trace.get('totalErrorCount');
      },
      getContent: number.compact
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

    return <Table maxItemsPerPage={30} cols={cols} rows={rows} />;
  }
);
