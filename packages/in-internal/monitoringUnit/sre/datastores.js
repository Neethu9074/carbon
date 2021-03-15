/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import {
  percentage,
  percentageZeroDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  kiloBytesZeroDecimalPlaces,
  kiloBytesTwoDecimalPlaces,
  withSiMultiplyPrefixZeroDecimalPlaces,
  withSiMultiplyPrefixThreeDecimalPlaces
} from 'in-services/formatters/number';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyMap } from 'in-services/fixedImmutables';
import { getMaxValue } from 'in-sdk/metrics';
import { t } from 'in-i18n';

export const hostTableCols = [
  {
    title: t('in-internal:monitoringUnit.sre.host'),
    type: 'snapshotLink',
    typeArgs: {
      pathname: physicalDashboardPath,
      getSnapshotId(row) {
        return row.host.get('id');
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.sre.user'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return `cpu.user`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.sre.system'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return `cpu.sys`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.sre.wait'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return `cpu.wait`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.sre.nice'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return `cpu.nice`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.sre.steal'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return `cpu.steal`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export const volumeTableCols = [
  {
    title: t('in-internal:monitoringUnit.sre.host'),
    type: 'snapshotLink',
    typeArgs: {
      pathname: physicalDashboardPath,
      getSnapshotId(row) {
        return row.snapshotId;
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.sre.datastores.device'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.device;
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.sre.datastores.capacity'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.fs.get('capacity');
      },
      getContent: kiloBytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-internal:monitoringUnit.sre.datastores.used'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `fs.${row.device}.used`;
      },
      getContent: percentage.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export function getDataMountRows(nodes, timeConfig) {
  var rows = [];

  nodes.forEach(node => {
    node.host.getIn(['data', 'filesystems'], emptyMap).forEach((v, k) => {
      if (v.get('mount').startsWith('/mnt/data')) {
        rows.push({
          key: node.host.get('id') + v.get('mount'),
          snapshotId: node.host.get('id'),
          device: k,
          snapshot: node,
          timeConfig: timeConfig,
          fs: v
        });
      }
    });
  });

  return rows;
}

export function getPersistentStorageMountRows(nodes, timeConfig) {
  var rows = [];

  nodes.forEach(node => {
    node.host.getIn(['data', 'filesystems'], emptyMap).forEach((v, k) => {
      if (v.get('mount').includes('kubernetes.io')) {
        rows.push({
          key: node.host.get('id') + v.get('mount'),
          snapshotId: node.host.get('id'),
          device: k,
          snapshot: node,
          timeConfig: timeConfig,
          fs: v
        });
      }
    });
  });

  return rows;
}

export function getHostDetails(row) {
  return (
    <Fragment>
      <DashboardSection title={t('in-internal:monitoringUnit.sre.datastores.cpuUsage')}>
        <Chart
          snapshotId={row.host.get('id')}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentageZeroDecimalPlaces,
            metrics: ['cpu.user', 'cpu.sys', 'cpu.wait', 'cpu.nice', 'cpu.steal'],
            labels: [
              t('in-internal:monitoringUnit.sre.user'),
              t('in-internal:monitoringUnit.sre.system'),
              t('in-internal:monitoringUnit.sre.wait'),
              t('in-internal:monitoringUnit.sre.nice'),
              t('in-internal:monitoringUnit.sre.steal')
            ],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
    </Fragment>
  );
}

export function getFsDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          max: getMaxValue('fs.' + row.device + '.free', row.snapshot.host),
          formatter: kiloBytesZeroDecimalPlaces,
          tooltipFormatter: kiloBytesTwoDecimalPlaces,
          metrics: ['fs.' + row.device + '.free', 'fs.' + row.device + '.leaked'],
          labels: [t('in-internal:monitoringUnit.sre.free'), t('in-internal:monitoringUnit.sre.leaked')],
          type: 'line'
        }}
      />

      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: withSiMultiplyPrefixZeroDecimalPlaces,
          tooltipFormatter: withSiMultiplyPrefixThreeDecimalPlaces,
          metrics: ['fs.' + row.device + '.reads', 'fs.' + row.device + '.writes'],
          labels: [t('in-internal:monitoringUnit.sre.readPerSec'), t('in-internal:monitoringUnit.sre.writePerSec')],
          type: 'line'
        }}
        y2={{
          min: 0,
          formatter: bytesZeroDecimalPlaces,
          tooltipFormatter: bytesTwoDecimalPlaces,
          metrics: ['fs.' + row.device + '.readBytes', 'fs.' + row.device + '.writeBytes'],
          labels: [
            t('in-internal:monitoringUnit.sre.bytesReadPerSec'),
            t('in-internal:monitoringUnit.sre.bytesWritePerSec')
          ],
          type: 'line'
        }}
      />
    </div>
  );
}
