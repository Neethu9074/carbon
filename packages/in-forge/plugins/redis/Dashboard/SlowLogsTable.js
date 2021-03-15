/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { formatDateTime } from 'in-services/formatters/date';
import { micros } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import NoWrap from 'in-sdk/components/common/NoWrap';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import './SlowLogsTable.less';

const block = 'in-redis-slow-logs';

const cols = [
  {
    title: t('in-forge:plugins.redis.dashboard.time'),
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
    title: t('in-forge:plugins.redis.dashboard.duration'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.slowLog.get('duration');
      },
      getContent: micros.detailed
    }
  },
  {
    title: t('in-forge:plugins.redis.dashboard.args'),
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
      <Table
        withoutPadding
        cardTitle={
          <TimeOfLastUpdateCardTitle
            title={t('in-forge:plugins.redis.dashboard.slowLogs')}
            timestamp={data.get('timestamp')}
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={1}
        initialSortDirection="desc"
      />
    );
  }
);

function Args({ args }) {
  return <code className={`${block}__slow-log`}>{args}</code>;
}
