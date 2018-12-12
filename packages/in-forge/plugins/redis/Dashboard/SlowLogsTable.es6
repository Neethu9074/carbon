import React from 'react';

import TimeOfLastUpdateDescriptionItem from 'in-sdk/components/sidebar/TimeOfLastUpdateDescriptionItem';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { muSecondsZeroDecimalPlaces } from 'in-services/formatters/number';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { formatDateTime } from 'in-services/formatters/date';
import Table from 'in-sdk/components/dashboard/Table';
import NoWrap from 'in-sdk/components/common/NoWrap';
import connectTo from 'in-hoc/connectTo';

import './SlowLogsTable.less';

const block = 'in-redis-slow-logs';

const cols = [
  {
    title: 'Time',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.slowLog.get('timestamp');
      },
      getContent(value) {
        return <NoWrap>{formatDateTime(value)}</NoWrap>;
      }
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
      data: getRawPayloadWithTimestamp(props.snapshotId, 'slow_logs')
    };
  },
  function SlowLogsTable({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const slowLogs = data.get('raw_payload');
    if (slowLogs.size === 0) {
      return null;
    }

    const rows = slowLogs.toArray().map((slowLog, idx) => {
      return {
        key: String(idx),
        slowLog
      };
    });

    return (
      <DashboardSection title={`Slow Logs (${rows.length})`}>
        <Table cols={cols} rows={rows} initialSortColumn={1} initialSortDirection="desc" />
        <TimeOfLastUpdateDescriptionItem data={data} />
      </DashboardSection>
    );
  }
);

function Args({ args }) {
  return <code className={`${block}__slow-log`}>{args}</code>;
}
