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
    title: t('in-forge:plugins.db2Database.type'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.backupDetail.get('TYPE');
      },
      getContent(args) {
         return <Args args={shorten(args, 128)} />;
       }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.startTime'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.backupDetail.get('START_TIME');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.endTime'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.backupDetail.get('END_TIME');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.backupDuration'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.backupDetail.get('DUR_TOTAL');
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
      data: getRawPayloadWithTimestamp(props.snapshotId, 'backupDetails')
    };
  },
  function BackupDetailsTable({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const backupDetails = data.get('raw_payload');
    if (backupDetails.size === 0) {
      return null;
    }

    const rows = backupDetails.toArray().map((backupDetail, idx) => {
      return {
        key: String(idx),
        backupDetail
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={
          <TimeOfLastUpdateCardTitle
            title={t('in-forge:plugins.db2Database.dashboard.backupDetails')}
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
  return <code className={locals.statement}>{args}</code>;
}
