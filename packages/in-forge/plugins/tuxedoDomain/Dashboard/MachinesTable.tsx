/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { combineLatest, just } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import getTuxedoMachinesForDomain from '../subscriptions/getTuxedoMachinesForDomain';
import { getSnapshot, SnapshotData } from 'in-stores/snapshot/snapshot';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.tuxedoMachine.lmid'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.tuxedoMachine.pmid'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'pmid']);
      }
    }
  },
  {
    title: t('in-forge:plugins.tuxedoMachine.role'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'role']);
      }
    }
  },
  {
    title: t('in-forge:plugins.tuxedoMachine.curAccessers'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.key;
      },
      getMetricName() {
        return 'curAccessers';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tuxedoMachine.numReq'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.key;
      },
      getMetricName() {
        return 'numReq';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tuxedoMachine.state'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'state']);
      }
    }
  },
  {
    title: t('in-forge:plugins.tuxedoMachine.health'),
    type: 'health',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.key;
      }
    }
  }
];

export default function GetMachines({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id') as string;
  const machines = useObservable(
    getTuxedoMachinesForDomain({ snapshotId, timeConfig: timeConfig }).flatMap(result =>
      result.data
        ? combineLatest(result.data.map(machine => getSnapshot(machine, timeConfig))).map(machines => success(machines))
        : just(pendingResult as Result<SnapshotData[]>)
    ),
    [snapshotId, timeConfig]
  );

  if (!machines?.data) {
    return null;
  }

  const rows =
    machines.data.map(machine => ({
      key: machine.get('id'),
      snapshot: machine,
      timeConfig
    })) || [];

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.tuxedoMachine.machinesWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
    />
  );
}
