import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { muSecondsZeroDecimalPlaces } from 'in-services/formatters/number';
import { formatDateTime } from 'in-services/formatters/date';
import Table from 'in-sdk/components/dashboard/Table';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

import './SlowLogsTable.less';

const block = 'in-redis-slow-logs';

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
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.slowLog.get('timestamp');
      },
      getContent: formatDateTime
    }
  },
  {
    title: 'Duration',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.slowLog.get('duration');
      },
      getContent: muSecondsZeroDecimalPlaces
    }
  },
  {
    title: 'Args',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.slowLog.get('args').join(' ');
      },
      getContent(args) {
        return <Args args={args} />;
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

function Args({ args }) {
  return <code className={`${block}__slow-log`}>{args}</code>;
}
