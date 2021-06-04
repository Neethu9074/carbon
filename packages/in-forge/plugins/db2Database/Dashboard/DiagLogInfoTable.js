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
    title: t('in-forge:plugins.db2Database.eventTimestamp'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('EVENT_TIMESTAMP');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.applID'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('APPL_ID');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.severity'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('SEVERITY');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.msgnum'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.topQuery.get('MSGNUM');
      },
      getContent: positiveNumber
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'diaglogentries')
    };
  },
  function DiagLogInfoTable({ data }) {
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
            title={t('in-forge:plugins.db2Database.dashboard.diagLogEntry')}
            timestamp={data.get('timestamp')}
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="desc"
        getRowDetails={getDetails}
      />
    );
  }
);

function getDetails(row) {
  return <code className={locals.statement}>{row.topQuery.get('MSG_SUMMARY')}</code>;
}

function Args({ args }) {
  return <code className={locals.statement}>{args}</code>;
}
