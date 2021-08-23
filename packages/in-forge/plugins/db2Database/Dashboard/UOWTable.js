/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number, bytes } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './RawTableFormat.mless';

const cols = [
  {
    title: t('in-forge:plugins.db2Database.appHandle'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('APPLICATION_HANDLE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.appName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('APPLICATION_NAME');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.clientAppName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('CLIENT_APPLNAME');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.appName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('APPLICATION_NAME');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.applicationID'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('APPLICATION_ID');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.numLockHeld'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('NUM_LOCKS_HELD');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.db2Database.uowLogSpaceUsed'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('UOW_LOG_SPACE_USED');
      },
      getContent: bytes.detailed
    }
  },
  {
    title: t('in-forge:plugins.db2Database.uowExecTime'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('UOW_EXEC_TIME_MS');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.db2Database.clientIdleTimeMin'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('CON_CLIENT_IDLE_TIME_MIN');
      },
      getContent: number.compact
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'uow')
    };
  },
  function DbConfigTable({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const topQueries = data.get('raw_payload');
    if (topQueries.size === 0) {
      return null;
    }

    const rows = topQueries.toArray().map((topQuery, idx) => {
      return {
        key: String(idx),
        topQuery
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={
          <TimeOfLastUpdateCardTitle
            title={t('in-forge:plugins.db2Database.dashboard.uow')}
            timestamp={data.get('timestamp')}
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);

function Args({ args }) {
  return <code className={locals.statement}>{args}</code>;
}
