import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { muSecondsZeroDecimalPlaces } from 'in-services/formatters/number';
import { formatDateTime } from 'in-services/formatters/date';
import Table from 'in-sdk/components/dashboard/Table';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: 'ID',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Time',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return formatDateTime(row.slowLog.get('timestamp'));
      }
    }
  },
  {
    title: 'Duration',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return muSecondsZeroDecimalPlaces(row.slowLog.get('duration'));
      }
    }
  },
  {
    title: 'Args',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.slowLog.get('args').join(' ');
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      slowLogs: getRawPayload(props.snapshotId, 'slow_logs').map(slowLogs =>
        slowLogs.toArray().sort((a, b) => a.get('timestamp') - b.get('timestamp'))
      )
    };
  },
  function SlowLogsTable({ slowLogs }) {
    if (!slowLogs || slowLogs.length === 0) {
      return null;
    }

    const rows = slowLogs.map(slowLog => {
      const id = slowLog.get('id');
      return {
        key: String(id),
        slowLog
      };
    });

    return (
      <DashboardSection title={`Slow Logs (${slowLogs.length})`}>
        <Table cols={cols} rows={rows} />
      </DashboardSection>
    );
  }
);
