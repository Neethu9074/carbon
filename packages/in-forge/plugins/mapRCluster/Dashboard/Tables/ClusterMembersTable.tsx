/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Set } from 'immutable';
import React from 'react';

import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error needs TS migration
import { getClusterMembers } from 'in-sdk/clusterMembers';
import { SnapshotData, getSnapshot } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface DatasourcesTableProps {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}

interface Row {
  key: string;
  snapshotId: string;
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.mapRCluster.nodeName'),
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.snapshot.getIn(['data', 'nodeName']);
      }
    }
  },
  {
    title: t('in-forge:plugins.mapRCluster.health'),
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.snapshot.getIn(['data', 'health']);
      }
    }
  },
  {
    title: t('in-forge:plugins.mapRCluster.mapRFSDisks'),
    type: 'number',
    typeArgs: {
      getValue(row: Row) {
        return row.snapshot.getIn(['data', 'mapRFSDisks']);
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-forge:plugins.mapRCluster.configuredService'),
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.snapshot.getIn(['data', 'configuredService']);
      }
    }
  }
];

export default function ClusterMembersTable({ snapshot, timeConfig }: DatasourcesTableProps) {
  const snapshotId = snapshot.get('id');
  const memberSnapshots = useObservable(
    getClusterMembers(snapshotId)
      .flatMap((memberSnapshotIds: Set<string>) =>
        combineLatest(memberSnapshotIds.toArray().map((snapshotId: string) => getSnapshot(snapshotId)))
      )
      .throttle(1000),
    [snapshotId, timeConfig]
  ) as SnapshotData[];

  if (!memberSnapshots) {
    return null;
  }

  const rows = memberSnapshots.map(memberSnapshot => {
    const id = memberSnapshot.get('id');
    return {
      key: id,
      snapshotId: id,
      snapshot: memberSnapshot,
      timeConfig
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.mapRCluster.nodeTableTitle', { len: rows.length })}
      cols={cols}
      rows={rows}
    />
  );
}
