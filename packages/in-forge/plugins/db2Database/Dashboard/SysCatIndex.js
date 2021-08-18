/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './RawTableFormat.mless';

const cols = [
  {
    title: t('in-forge:plugins.db2Database.tabName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('TABNAME');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.indSchema'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('INDSCHEMA');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.indName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('INDNAME');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.statsTime'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('STATS_TIME');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.lastUsed'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('LASTUSED');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'syscatIndex')
    };
  },
  function SysCatIndex({ snapshot, data }) {
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
            title={
              t('in-forge:plugins.db2Database.dashboard.sysCatIndex') +
              '- ' +
              snapshot.get('data').get('tabschema') +
              ' Schema'
            }
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={3}
        getRowDetails={getDetails}
        initialSortDirection="asc"
      />
    );
  }
);

function getDetails(row) {
  return (
    <div>
      <label>Unique Rule:</label>
      <p />
      <code className={locals.statement}>{row.topQuery.get('UNIQUERULE')}</code>
      <p />
      <label>Column Names:</label>
      <p />
      <code className={locals.statement}>{row.topQuery.get('COLNAMES')}</code>
    </div>
  );
}

function Args({ args }) {
  return <code className={locals.statement}>{args}</code>;
}
