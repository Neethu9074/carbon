/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { fromJS } from 'immutable';
import React from 'react';

import {
  percentageZeroDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesPerSecondZeroDecimalPlaces,
  number
} from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { SummaryData } from 'in-xenserver/Dashboards/VM/tabs/Summary';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-xenserver:dashboards.interface'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.name;
      }
    }
  },
  {
    title: t('in-xenserver:dashboards.vm.mac'),
    type: 'string',
    typeArgs: {
      getValue(row: any) {
        return row.iface.get('mac');
      }
    }
  },
  {
    title: t('in-xenserver:dashboards.bytesRx'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `vif.${row.name}.rx`;
      },
      getContent: bytesPerSecondZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-xenserver:dashboards.rxErrors'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `vif.${row.name}.rx_errors`;
      },
      getContent: percentageZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-xenserver:dashboards.bytesTx'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `vif.${row.name}.tx`;
      },
      getContent: bytesPerSecondZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-xenserver:dashboards.txErrors'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: any) {
        return row.snapshotId;
      },
      getMetricName(row: any) {
        return `vif.${row.name}.tx_errors`;
      },
      getContent: percentageZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function VirtualNetworkInterfacesTable({ data: vmSnapshot, timeConfig }: SummaryData) {
  vmSnapshot = fromJS(vmSnapshot);
  const rows = (vmSnapshot.getIn(['interfaces'], emptyMap) || emptyMap)
    ?.map((iface: any, name: any) => {
      return {
        key: name,
        name,
        iface,
        snapshotId: vmSnapshot.get('id'),
        timeConfig
      };
    })
    .valueSeq()
    .toArray();
  return (
    <Table
      cardTitle={t('in-xenserver:dashboards.networkInterfaces')}
      withoutPadding
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
}

function getDetails(row: { snapshotId: string | undefined; timeConfig: TimeConfig; name: string }) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        min: 0,
        formatter: bytesZeroDecimalPlaces,
        metrics: ['vif.' + row.name + '.rx', 'vif.' + row.name + '.tx'],
        labels: [t('in-xenserver:dashboards.bytesRx'), t('in-xenserver:dashboards.bytesRx')],
        type: 'line'
      }}
      y2={{
        min: 0,
        metrics: ['vif.' + row.name + '.rx_errors', 'vif.' + row.name + '.tx_errors'],
        labels: [t('in-xenserver:dashboards.rxErrors'), t('in-xenserver:dashboards.txErrors')],
        formatter: number.perSecond.compact,
        type: 'line'
      }}
    />
  );
}
