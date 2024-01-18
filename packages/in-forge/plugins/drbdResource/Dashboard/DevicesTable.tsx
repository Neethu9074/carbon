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
import getDrbdDevicesForResource from '../subscriptions/getDrbdDevicesForResource';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

const deviceLinkCol = {
  title: t('in-forge:plugins.drbdDevice.deviceName'),
  type: 'snapshotLink',
  typeArgs: {
    getSnapshotId(row: any) {
      return row.key;
    }
  }
};

const deviceDataCol = [
  {
    title: t('in-forge:plugins.drbdDevice.dashboard.volume'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'volume']);
      }
    }
  },
  {
    title: t('in-forge:plugins.drbdDevice.dashboard.minor'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.snapshot.getIn(['data', 'minor']);
      }
    }
  }
];

const deviceMetricsCol = [
  {
    title: t('in-forge:plugins.drbdDevice.drbdDeviceWrittenBytesTotal'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.key;
      },
      getMetricName() {
        return `drbdDeviceWrittenBytesTotal`;
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.drbdDevice.drbdDeviceReadBytesTotal'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.key;
      },
      getMetricName() {
        return 'drbdDeviceReadBytesTotal';
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.drbdDevice.dashboard.drbdDeviceSizeBytes'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.key;
      },
      getMetricName() {
        return 'drbdDeviceSizeBytes';
      },
      getContent: number.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DevicesTable({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id') as string;

  const drbdDevices = useObservable(
    getDrbdDevicesForResource({ snapshotId, timeConfig: timeConfig }).flatMap(result =>
      result.data
        ? combineLatest(result.data.map(drbdDevice => getSnapshot(drbdDevice, timeConfig))).map(drbdDevices =>
            success(drbdDevices)
          )
        : just(pendingResult as Result<SnapshotData[]>)
    ),
    [snapshotId, timeConfig]
  );

  if (!drbdDevices?.data) {
    return null;
  }

  const rows =
    drbdDevices.data.map(drbdDevice => ({
      key: drbdDevice.get('id'),
      snapshot: drbdDevices,
      timeConfig
    })) || [];

  const cols = [deviceLinkCol, deviceDataCol, deviceMetricsCol];
  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.drbdDevice.devicesWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
    />
  );
}
