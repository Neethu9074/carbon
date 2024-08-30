/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Set } from 'immutable';
import React from 'react';

import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error needs TS migration
import { getClusterMembers } from 'in-sdk/clusterMembers';
import { SnapshotData, getSnapshot } from 'in-stores/snapshot';
import { bytes, number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface MembersRow {
  key: string;
  snapshotId: string;
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}

const nodeCols = [
  {
    title: t('in-forge:plugins.tibcoASDataGrid.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row: MembersRow) {
        return row.snapshotId;
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoASDataGrid.type'),
    type: 'string',
    typeArgs: {
      getValue(row: MembersRow) {
        return row.snapshot.getIn(['data', 'nodeType']);
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoASDataGrid.version'),
    type: 'string',
    typeArgs: {
      getValue(row: MembersRow) {
        return row.snapshot.getIn(['data', 'version']);
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoASDataGrid.liveDataSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: MembersRow) {
        return row.key;
      },
      getMetricName() {
        return 'liveDataSize';
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoASDataGrid.numberOfListeners'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: MembersRow) {
        return row.key;
      },
      getMetricName() {
        return 'numberOfListeners';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoASDataGrid.titleHealth'),
    type: 'health',
    typeArgs: {
      getSnapshotId(row: MembersRow) {
        return row.snapshotId;
      }
    }
  }
];
const proxyCols = [
  {
    title: t('in-forge:plugins.tibcoASDataGrid.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row: MembersRow) {
        return row.snapshotId;
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoASDataGrid.version'),
    type: 'string',
    typeArgs: {
      getValue(row: MembersRow) {
        return row.snapshot.getIn(['data', 'version']);
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoASDataGrid.titleHealth'),
    type: 'health',
    typeArgs: {
      getSnapshotId(row: MembersRow) {
        return row.snapshotId;
      }
    }
  }
];
const pluginName = 'plugin';
const nodePlugin = 'tibcoASNode';
const proxyPlugin = 'tibcoASProxy';

function filterByPlugin(data: SnapshotData[], pluginEntityName: string): SnapshotData[] {
  return data.filter(item => item.has(pluginName) && item.get(pluginName) === pluginEntityName);
}
function buildMemberRows(memberSnapshot: SnapshotData[], timeConfig: TimeConfig): MembersRow[] {
  return memberSnapshot.map(snapshotData => {
    const id = snapshotData.get('id');
    return {
      key: id,
      snapshotId: id,
      snapshot: snapshotData,
      timeConfig
    };
  });
}
export default function DataGridMembersTable({
  snapshotId,
  timeConfig
}: {
  snapshotId: string;
  timeConfig: TimeConfig;
}) {
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
  let nodeMemberSnapshots: SnapshotData[] = filterByPlugin(memberSnapshots, nodePlugin);
  let proxyMemberSnapshots: SnapshotData[] = filterByPlugin(memberSnapshots, proxyPlugin);

  const nodeRows = buildMemberRows(nodeMemberSnapshots, timeConfig);
  const proxyRows = buildMemberRows(proxyMemberSnapshots, timeConfig);

  return (
    <>
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.tibcoASDataGrid.nodeTableTitle', { len: nodeRows.length })}
        cols={nodeCols}
        rows={nodeRows}
      />
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.tibcoASDataGrid.proxyTableTitle', { len: proxyRows.length })}
        cols={proxyCols}
        rows={proxyRows}
      />
    </>
  );
}
