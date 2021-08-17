/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './RawTableFormat.mless';

const cols = [
  {
    title: t('in-forge:plugins.db2Database.hadrRole'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('HADR_ROLE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.hadrReplayType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('REPLAY_TYPE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.hadrSyncMode'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('HADR_SYNCMODE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  /*{
    title: t('in-forge:plugins.db2Database.hadrStandbyId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('STANDBY_ID');
      },
      getContent(args) {
              return <Args args={shorten(args, 128)} />;
            }
    }
  },*/
  {
    title: t('in-forge:plugins.db2Database.hadrLogStreamId'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('LOG_STREAM_ID');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.db2Database.hadrState'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('HADR_STATE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.hadrConnectStat'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('HADR_CONNECT_STATUS');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.hadrConnectStatTime'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('HADR_CONNECT_STATUS_TIME');
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
      data: getRawPayloadWithTimestamp(props.snapshotId, 'hadrstats')
    };
  },
  function HadrGenericsTable({ data }) {
    console.log('DATA: ' + JSON.stringify(data));
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const hadrGenerics = data.get('raw_payload');
    if (hadrGenerics.size === 0) {
      return null;
    }

    const rows = hadrGenerics.toArray().map((hadrGeneric, idx) => {
      return {
        key: String(idx),
        hadrGeneric
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={
          <TimeOfLastUpdateCardTitle
            title={t('in-forge:plugins.db2Database.dashboard.hadrGenerics')}
            timestamp={data.get('timestamp')}
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={6}
        initialSortDirection="desc"
      />
    );
  }
);

function Args({ args }) {
  return <code className={locals.statement}>{args}</code>;
}
