/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { combineLatest, just } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import getDrbdConnectionsForResource from '../subscriptions/getDrbdConnectionsForResource';
import { getSnapshot, SnapshotData } from 'in-stores/snapshot/snapshot';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

const connectionLinkCol = {
  title: t('in-forge:plugins.drbdResource.connUniqueName'),
  type: 'snapshotLink',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.key;
    }
  }
};

const connectionDataCol1 = {
  title: t('in-forge:plugins.drbdConnection.connectionName'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.snapshot.getIn(['data', 'connectionName']);
    }
  }
};
const connectionDataCol2 = {
  title: t('in-forge:plugins.drbdConnection.connectionState'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.snapshot.getIn(['data', 'connectionState']);
    }
  }
};

const connectionDataCol3 = {
  title: t('in-forge:plugins.drbdConnection.peerNodeId'),
  type: 'string',
  typeArgs: {
    getValue(row: any) {
      return row.snapshot.getIn(['data', 'peerNodeId']);
    }
  }
};

const connectionMetricsCol1 = {
  title: t('in-forge:plugins.drbdConnection.connectionRsInFlightBytes'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.key;
    },
    getMetricName() {
      return `connectionRsInFlightBytes`;
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};
const connectionMetricsCol2 = {
  title: t('in-forge:plugins.drbdConnection.connectionApInFlightBytes'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.key;
    },
    getMetricName() {
      return 'connectionApInFlightBytes';
    },
    getContent: number.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};
const connectionMetricsCol3 = {
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
};

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
      snapshot: drbdConnection,
      timeConfig
    })) || [];

  const cols = [
    connectionLinkCol,
    connectionDataCol1,
    connectionDataCol2,
    connectionDataCol3,
    connectionMetricsCol1,
    connectionMetricsCol2,
    connectionMetricsCol3
  ];

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.drbdResource.connectionsWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
    />
  );
}
