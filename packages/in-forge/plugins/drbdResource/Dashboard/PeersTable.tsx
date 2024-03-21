/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { combineLatest, just } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import getDrbdPeerDevicesForResource from '../subscriptions/getDrbdPeerDevicesForResource';
import { getSnapshot, SnapshotData } from 'in-stores/snapshot/snapshot';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

const peerLinkCol = {
  title: t('in-forge:plugins.drbdPeerDevice.peerDeviceName'),
  type: 'snapshotLink',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.key;
    }
  }
};

const peerDataCol1 = {
  title: t('in-forge:plugins.drbdPeerDevice.connectionName'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.snapshot.getIn(['data', 'connectionName']);
    }
  }
};
const peerDataCol2 = {
  title: t('in-forge:plugins.drbdPeerDevice.peerNodeId'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.snapshot.getIn(['data', 'peerNodeId']);
    }
  }
};
const peerDataCol3 = {
  title: t('in-forge:plugins.drbdPeerDevice.volume'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.snapshot.getIn(['data', 'volume']);
    }
  }
};

const peerMetricsCol = {
  title: t('in-forge:plugins.drbdPeerDevice.peerDeviceOutOfSyncBytes'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.key;
    },
    getMetricName() {
      return 'peerDeviceOutOfSyncBytes';
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

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
      snapshot: drbdPeer,
      timeConfig
    })) || [];

  const cols = [peerLinkCol, peerDataCol1, peerDataCol2, peerDataCol3, peerMetricsCol];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.drbdResource.peersWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
    />
  );
}
