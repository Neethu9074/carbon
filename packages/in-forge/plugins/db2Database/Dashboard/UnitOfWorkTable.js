/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { positiveNumber } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './RawTableFormat.mless';

const cols = [
  {
    title: t('in-forge:plugins.db2Database.applicationHandle'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('APPLICATION_HANDLE');
      },
      getContent: positiveNumber
    }
  },
  {
    title: t('in-forge:plugins.db2Database.applicationName'),
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
    title: t('in-forge:plugins.db2Database.clientAcctng'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('CLIENT_ACCTNG');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.clientApplName'),
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
    title: t('in-forge:plugins.db2Database.applId'),
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
    title: t('in-forge:plugins.db2Database.clientWrkstnName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('CLIENT_WRKSTNNAME');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },

  {
    title: t('in-forge:plugins.db2Database.numLocksHeld'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('NUM_LOCKS_HELD');
      },
      getContent: positiveNumber
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'uowqueries')
    };
  },
  function UnitOfWorkTable({ data }) {
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
            title={t('in-forge:plugins.db2Database.dashboard.uowQueries')}
            timestamp={data.get('timestamp')}
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={3}
        initialSortDirection="desc"
      />
    );
  }
);

function Args({ args }) {
  return <code className={locals.statement}>{args}</code>;
}
