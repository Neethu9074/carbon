/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { fromJS } from 'immutable';
import React from 'react';

import { bytesPerSecondTwoDecimalPlaces, number } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { SummaryData } from 'in-xenserver/Dashboards/VM/tabs/Summary';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-xenserver:dashboards.vblockDevice.deviceName'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.name;
      }
    }
  },
  {
    title: t('in-xenserver:dashboards.vblockDevice.mode'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.vbd.get('mode');
      }
    }
  },
  {
    title: t('in-xenserver:dashboards.vblockDevice.type'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.vbd.get('type');
      }
    }
  },
  {
    title: t('in-xenserver:dashboards.vblockDevice.iopsRead'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `vbd.${row.name}.iops_read`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-xenserver:dashboards.vblockDevice.iopsWrite'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `vbd.${row.name}.iops_write`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-xenserver:dashboards.vblockDevice.read'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `vbd.${row.name}.read`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-xenserver:dashboards.vblockDevice.write'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `vbd.${row.name}.write`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function BlockDeviceTable({ data: vmSnapshot, timeConfig }: SummaryData) {
  vmSnapshot = fromJS(vmSnapshot);
  const rows = (vmSnapshot.getIn(['blockDevices'], emptyMap) || emptyMap)
    ?.map((vbd: any, name: any) => {
      return {
        key: name,
        name,
        vbd,
        snapshotId: vmSnapshot.get('id'),
        timeConfig
      };
    })
    .valueSeq()
    .toArray();
  return (
    <Table
      cardTitle={t('in-xenserver:dashboards.blockDevice')}
      withoutPadding
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
}

function getDetails(row: { snapshotId: string | undefined; timeConfig: TimeConfig; name: string }) {
  return (
    <Columize>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: number.compact,
          metrics: ['vbd.' + row.name + '.iops_read', 'vbd.' + row.name + '.iops_write'],
          labels: [
            t('in-xenserver:dashboards.vblockDevice.readPerSec'),
            t('in-xenserver:dashboards.vblockDevice.writePerSec')
          ],
          type: 'line'
        }}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: bytesPerSecondTwoDecimalPlaces,
          metrics: ['vbd.' + row.name + '.read', 'vbd.' + row.name + '.write'],
          labels: [t('in-xenserver:dashboards.vblockDevice.read'), t('in-xenserver:dashboards.vblockDevice.write')],
          type: 'line'
        }}
      />
    </Columize>
  );
}
