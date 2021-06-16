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
    title: t('in-forge:plugins.db2Database.dbConfigName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('NAME');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.valueFlags'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('VALUE_FLAGS');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.deferredValueFlags'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('DEFERRED_VALUE_FLAGS');
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
      data: getRawPayloadWithTimestamp(props.snapshotId, 'dbmConfig')
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
            title={t('in-forge:plugins.db2Database.dashboard.dbmConfig')}
            timestamp={data.get('timestamp')}
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        getRowDetails={getDetails}
        initialSortDirection="asc"
      />
    );
  }
);

function getDetails(row) {
  return (
    <div>
      <label>Value:</label>
      <p />
      <code className={locals.statement}>{row.topQuery.get('VALUE')}</code>
      <p />
      <label>Deferred Value:</label>
      <p />
      <code className={locals.statement}>{row.topQuery.get('DEFERRED_VALUE')}</code>
    </div>
  );
}

function Args({ args }) {
  return <code className={locals.statement}>{args}</code>;
}
