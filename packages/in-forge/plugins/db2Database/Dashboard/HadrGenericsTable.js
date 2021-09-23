/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import { number, millis, seconds } from 'in-services/formatters/number';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { yesOrNo } from 'in-services/formatters/boolean';
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
  {
    title: t('in-forge:plugins.db2Database.hadrStandbyId'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('STANDBY_ID');
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
  },
  {
    title: t('in-forge:plugins.db2Database.hadrTimeout'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('HADR_TIMEOUT');
      },
      getContent: seconds.detailed
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
  }
];
const colsConnect = [
  {
    title: t('in-forge:plugins.db2Database.primaryHost'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('PRIMARY_MEMBER_HOST');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.primaryInstance'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('PRIMARY_INSTANCE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.primaryMember'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return yesOrNo(row.hadrGeneric.get('PRIMARY_MEMBER'));
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.standbyHost'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('STANDBY_MEMBER_HOST');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.standbyInstance'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('STANDBY_INSTANCE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.standbyMember'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return yesOrNo(row.hadrGeneric.get('STANDBY_MEMBER'));
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.heartbeatInterval'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('HEARTBEAT_INTERVAL');
      },
      getContent: millis.detailed
    }
  },
  {
    title: t('in-forge:plugins.db2Database.peerWaitLimit'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('PEER_WAIT_LIMIT');
      },
      getContent: number.compact
    }
  }
];
const colsPrimaryLog = [
  {
    title: t('in-forge:plugins.db2Database.primLogFile'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('PRIMARY_LOG_FILE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.primLogPage'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('PRIMARY_LOG_PAGE');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.db2Database.primLogPos'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('PRIMARY_LOG_POS');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.db2Database.primLogTime'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('PRIMARY_LOG_TIME');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
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
    title: t('in-forge:plugins.db2Database.hadrWaitsTotal'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('LOG_HADR_WAITS_TOTAL');
      },
      getContent: number.compact
    }
  }
];

const colsSecondaryLog = [
  {
    title: t('in-forge:plugins.db2Database.secLogFile'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('STANDBY_LOG_FILE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.secLogPage'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('STANDBY_LOG_PAGE');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.db2Database.secLogPos'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('STANDBY_LOG_POS');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.db2Database.secLogTime'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.hadrGeneric.get('STANDBY_LOG_TIME');
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
      <div>
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
          initialSortDirection="desc"
        />
        <Table
          withoutPadding
          cardTitle={
            <TimeOfLastUpdateCardTitle
              title={t('in-forge:plugins.db2Database.dashboard.hadrConnect')}
              timestamp={data.get('timestamp')}
            />
          }
          cols={colsConnect}
          rows={rows}
          initialSortDirection="desc"
        />
        <Table
          withoutPadding
          cardTitle={
            <TimeOfLastUpdateCardTitle
              title={t('in-forge:plugins.db2Database.dashboard.hadrPrimaryLog')}
              timestamp={data.get('timestamp')}
            />
          }
          cols={colsPrimaryLog}
          rows={rows}
          initialSortDirection="desc"
        />
        <Table
          withoutPadding
          cardTitle={
            <TimeOfLastUpdateCardTitle
              title={t('in-forge:plugins.db2Database.dashboard.hadrSecondaryLog')}
              timestamp={data.get('timestamp')}
            />
          }
          cols={colsSecondaryLog}
          rows={rows}
          initialSortDirection="desc"
        />
      </div>
    );
  }
);

function Args({ args }) {
  return <code className={locals.statement}>{args}</code>;
}
