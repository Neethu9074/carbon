/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
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
    title: t('in-forge:plugins.db2Database.pgHostName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.PurescaleGeneralDetail.get('HOSTNAME');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.pgState'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.PurescaleGeneralDetail.get('STATE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.instanceStopped'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.PurescaleGeneralDetail.get('INSTANCE_STOPPED');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.pgAlert'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.PurescaleGeneralDetail.get('ALERT');
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
      data: getRawPayloadWithTimestamp(props.snapshotId, 'purescaleGeneral')
    };
  },
  function PurescaleGeneralTable({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const PurescaleGeneralDetails = data.get('raw_payload');
    if (PurescaleGeneralDetails.size === 0) {
      return null;
    }

    const rows = PurescaleGeneralDetails.toArray().map((PurescaleGeneralDetail, idx) => {
      return {
        key: String(idx),
        PurescaleGeneralDetail
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={
          <TimeOfLastUpdateCardTitle
            title={t('in-forge:plugins.db2Database.dashboard.purescaleGeneralDetails')}
            timestamp={data.get('timestamp')}
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="desc"
      />
    );
  }
);

function Args({ args }) {
  return <code className={locals.statement}>{args}</code>;
}
