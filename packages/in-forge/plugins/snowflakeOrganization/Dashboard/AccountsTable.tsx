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

//import { bytes, number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
// @ts-expect-error needs TS migration
import { getClusterMembers } from 'in-sdk/clusterMembers';
import { SnapshotData, getSnapshot } from 'in-stores/snapshot';
import { t } from 'in-i18n';

interface AccountsRow {
  key: string;
  snapshotId: string;
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}

const accountCols = [
  {
    title: t('in-forge:plugins.snowflakeOrganization.dashboard.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row: AccountsRow) {
        return row.snapshotId;
      }
    }
  },
  {
    title: t('in-forge:plugins.snowflakeOrganization.dashboard.region'),
    type: 'string',
    typeArgs: {
      getValue(row: AccountsRow) {
        return row.snapshot.getIn(['data', 'region']);
      }
    }
  }
  //   {
  //     title: t('in-forge:plugins.tibcoASDataGrid.version'),
  //     type: 'string',
  //     typeArgs: {
  //       getValue(row: AccountsRow) {
  //         return row.snapshot.getIn(['data', 'version']);
  //       }
  //     }
  //   },
  //   {
  //     title: t('in-forge:plugins.tibcoASDataGrid.liveDataSize'),
  //     type: 'metric',
  //     typeArgs: {
  //       getSnapshotId(row: AccountsRow) {
  //         return row.key;
  //       },
  //       getMetricName() {
  //         return 'liveDataSize';
  //       },
  //       getContent: bytes.compact,
  //       getTimeWindowAggregation() {
  //         return 'mean';
  //       }
  //     }
  //   },
  //   {
  //     title: t('in-forge:plugins.tibcoASDataGrid.numberOfListeners'),
  //     type: 'metric',
  //     typeArgs: {
  //       getSnapshotId(row: AccountsRow) {
  //         return row.key;
  //       },
  //       getMetricName() {
  //         return 'numberOfListeners';
  //       },
  //       getContent: number.compact,
  //       getTimeWindowAggregation() {
  //         return 'mean';
  //       }
  //     }
  //   },
  //   {
  //     title: t('in-forge:plugins.tibcoASDataGrid.titleHealth'),
  //     type: 'health',
  //     typeArgs: {
  //       getSnapshotId(row: AccountsRow) {
  //         return row.snapshotId;
  //       }
  //     }
  //   }
];
const pluginName = 'plugin';
const AccountPlugin = 'snowflake';

function filterByPlugin(data: SnapshotData[], pluginEntityName: string): SnapshotData[] {
  return data.filter(item => item.has(pluginName) && item.get(pluginName) === pluginEntityName);
}
function buildMemberRows(memberSnapshot: SnapshotData[], timeConfig: TimeConfig): AccountsRow[] {
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
export default function AccountsTable({ snapshotId, timeConfig }: { snapshotId: string; timeConfig: TimeConfig }) {
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
  let accountMemberSnapshots: SnapshotData[] = filterByPlugin(memberSnapshots, AccountPlugin);

  const accountRows = buildMemberRows(accountMemberSnapshots, timeConfig);

  return (
    <>
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.snowflakeOrganization.dashboard.accountsMonitored', { len: accountRows.length })}
        cols={accountCols}
        rows={accountRows}
      />
    </>
  );
}
