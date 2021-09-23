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
    title: t('in-forge:plugins.db2Database.tabSchema'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('TABSCHEMA');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.reorgStatus'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('REORG_STATUS');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.reorgCompletion'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('REORG_COMPLETION');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.reorgStart'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('REORG_START');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.reorgEnd'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('REORG_END');
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
      data: getRawPayloadWithTimestamp(props.snapshotId, 'reorg')
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
            title={t('in-forge:plugins.db2Database.dashboard.reorg')}
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
