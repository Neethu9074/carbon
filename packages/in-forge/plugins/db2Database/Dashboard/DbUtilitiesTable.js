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
    title: t('in-forge:plugins.db2Database.utilityOperationType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('UTILITY_OPERATION_TYPE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.objectType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('OBJECT_TYPE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.utilityStartTime'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('UTILITY_START_TIME');
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
      data: getRawPayloadWithTimestamp(props.snapshotId, 'dbutilities')
    };
  },
  function DbUtilitiesTable({ data }) {
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
            title={t('in-forge:plugins.db2Database.dashboard.dbutilities')}
            timestamp={data.get('timestamp')}
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        getRowDetails={getDetails}
        initialSortDirection="desc"
      />
    );
  }
);

function getDetails(row) {
  return (
    <div>
      <label>Utility Type : </label>
      <code className={locals.statement}> {row.topQuery.get('UTILITY_TYPE')} </code>
      <p />
      <label>Utility_Detail :</label>
      <code className={locals.statement}> {row.topQuery.get('UTILITY_DETAIL')} </code>
      <p />
      <label>Session Auth ID : </label>
      <code className={locals.statement}> {row.topQuery.get('SESSION_AUTH_ID')} </code>
      <p />
      <label>Client Workstation Name : </label>
      <code className={locals.statement}> {row.topQuery.get('CLIENT_WRKSTNNAME')} </code>
      <p />
      <label>Client Accounting : </label>
      <code className={locals.statement}> {row.topQuery.get('CLIENT_ACCTNG')} </code>
      <p />
      <label>Client Userid : </label>
      <code className={locals.statement}> {row.topQuery.get('CLIENT_USERID')} </code>
      <p />
      <label>Object Schema : </label>
      <code className={locals.statement}> {row.topQuery.get('OBJECT_SCHEMA')} </code>
      <p />
      <label>Client Application Name : </label>
      <code className={locals.statement}> {row.topQuery.get('CLIENT_APPLNAME')} </code>
    </div>
  );
}

function Args({ args }) {
  return <code className={locals.statement}>{args}</code>;
}
