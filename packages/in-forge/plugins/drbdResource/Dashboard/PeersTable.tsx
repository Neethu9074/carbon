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
import getDrbdPeerDevicesForResource from '../subscriptions/getDrbdPeerDevicesForResource';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

const peerLinkCol = {
  title: t('in-forge:plugins.drbdPeer.peerDeviceName'),
  type: 'snapshotLink',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.key;
    }
  }
};

const peerDataCol = [
  {
    title: t('in-forge:plugins.drbdPeer.dashboard.connectionName'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'connectionName']);
      }
    }
  },
  {
    title: t('in-forge:plugins.drbdPeer.dashboard.peerNodeId'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'peerNodeId']);
      }
    }
  },
  {
    title: t('in-forge:plugins.drbdPeer.dashboard.volume'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'volume']);
      }
    }
  }
];

const peerMetricsCol = [
  {
    title: t('in-forge:plugins.drbdPeer.dashboard.peerDeviceOutofsyncBytes'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.key;
      },
      getMetricName() {
        return 'peerPeerOutofsyncBytes';
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function PeersTable({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id') as string;

  const drbdPeers = useObservable(
    getDrbdPeerDevicesForResource({ snapshotId, timeConfig: timeConfig }).flatMap(result =>
      result.data
        ? combineLatest(result.data.map(drbdPeer => getSnapshot(drbdPeer, timeConfig))).map(drbdPeers =>
            success(drbdPeers)
          )
        : just(pendingResult as Result<SnapshotData[]>)
    ),
    [snapshotId, timeConfig]
  );

  if (!drbdPeers?.data) {
    return null;
  }

  const rows =
    drbdPeers.data.map(drbdPeer => ({
      key: drbdPeer.get('id'),
      snapshot: drbdPeers,
      timeConfig
    })) || [];

  const cols = [peerLinkCol, peerDataCol, peerMetricsCol];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.drbdPeer.peersWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
    />
  );
}
