/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { combineLatest, just } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

// import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { getSnapshot, SnapshotData } from 'in-stores/snapshot/snapshot';
import getDrbdConnectionsForResource from '../subscriptions/getDrbdConnectionsForResource';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

const connectionLinkCol = {
  title: t('in-forge:plugins.drbdConnection.connName'),
  type: 'snapshotLink',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.key;
    }
  }
};

const connectionDataCol = [
  {
    title: t('in-forge:plugins.drbdConnection.dashboard.connectionName'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'connectionName']);
      }
    }
  },
  {
    title: t('in-forge:plugins.drbdConnection.dashboard.connectionState'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'connectionState']);
      }
    }
  },
  {
    title: t('in-forge:plugins.drbdConnection.dashboard.peerNodeId'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'peerNodeId']);
      }
    }
  }
];

const connectionMetricsCol = [
  {
    title: t('in-forge:plugins.drbdConnection.dashboard.connectionRsinflightBytes'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.key;
      },
      getMetricName() {
        return `connectionRsinflightBytes`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.drbdConnection.dashboard.connectionApinflightBytes'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.key;
      },
      getMetricName() {
        return 'connectionApinflightBytes';
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.drbdConnection.connectionCongested'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.key;
      },
      getMetricName() {
        return 'connectionCongested';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ConnectionsTable({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id') as string;

  const drbdConnections = useObservable(
    getDrbdConnectionsForResource({ snapshotId, timeConfig: timeConfig }).flatMap(result =>
      result.data
        ? combineLatest(result.data.map(drbdConnection => getSnapshot(drbdConnection, timeConfig))).map(
            drbdConnections => success(drbdConnections)
          )
        : just(pendingResult as Result<SnapshotData[]>)
    ),
    [snapshotId, timeConfig]
  );

  if (!drbdConnections?.data) {
    return null;
  }

  const rows =
    drbdConnections.data.map(drbdConnection => ({
      key: drbdConnection.get('id'),
      snapshot: drbdConnections,
      timeConfig
    })) || [];

  const cols = [connectionLinkCol, connectionDataCol, connectionMetricsCol];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.drbdConnection.connectionsWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
    />
  );
}
