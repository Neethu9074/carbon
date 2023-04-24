/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { combineLatest, just } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import getTuxedoServersForMachine from '../subscriptions/getTuxedoServersForMachine';
import { getSnapshot, SnapshotData } from 'in-stores/snapshot/snapshot';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.tuxedoServer.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.tuxedoServer.id'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'id']).toString();
      }
    }
  },
  {
    title: t('in-forge:plugins.tuxedoServer.pid'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'pid']).toString();
      }
    }
  },
  {
    title: t('in-forge:plugins.tuxedoServer.groupNo'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'grpNo']).toString();
      }
    }
  },
  {
    title: t('in-forge:plugins.tuxedoServer.groupName'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'grpName']);
      }
    }
  },
  {
    title: t('in-forge:plugins.tuxedoServer.queued'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.key;
      },
      getMetricName() {
        return 'numQueued';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tuxedoServer.completed'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.key;
      },
      getMetricName() {
        return 'numCompleted';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tuxedoServer.state'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'state']).toString();
      }
    }
  },
  {
    title: t('in-forge:plugins.tuxedoServer.health'),
    type: 'health',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.key;
      }
    }
  }
];

export default function ServersTable({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id');
  const servers = useObservable(
    getTuxedoServersForMachine({ snapshotId, timeConfig: timeConfig }).flatMap(result =>
      result.data
        ? combineLatest(result.data.map(server => getSnapshot(server, timeConfig))).map(servers => success(servers))
        : just(pendingResult as Result<SnapshotData[]>)
    ),
    [snapshotId, timeConfig]
  );
  if (!servers?.data) {
    return null;
  }

  const rows =
    servers.data.map(server => ({
      key: server.get('id'),
      snapshot: server,
      timeConfig
    })) || [];

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.tuxedoServer.serversWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
    />
  );
}
