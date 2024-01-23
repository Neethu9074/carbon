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
    title: t('in-forge:plugins.db2Database.cfId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.db2CfDetail.get('ID');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.cfState'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.db2CfDetail.get('STATE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.cfHomeHost'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.db2CfDetail.get('HOME_HOST');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.cfCurrentHost'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.db2CfDetail.get('CURRENT_HOST');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.db2CfAlert'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.db2CfDetail.get('ALERT');
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
      data: getRawPayloadWithTimestamp(props.snapshotId, 'db2Cf')
    };
  },
  function Db2CfTable({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const db2CfDetails = data.get('raw_payload');
    if (db2CfDetails.size === 0) {
      return null;
    }

    const rows = db2CfDetails.toArray().map((db2CfDetail, idx) => {
      return {
        key: String(idx),
        db2CfDetail
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={
          <TimeOfLastUpdateCardTitle
            title={t('in-forge:plugins.db2Database.dashboard.db2cfDetails')}
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
