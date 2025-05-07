/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    id: 'systemProcs',
    title: t('in-forge:plugins.host.dashboard.systemProcs'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'cpu.systemProcs';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    id: 'processesRunnable',
    title: t('in-forge:plugins.host.dashboard.processesRunnable'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'cpu.processesRunnable';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    id: 'processesThreadsWaiting',
    title: t('in-forge:plugins.host.dashboard.processesThreadsWaiting'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'cpu.processesThreadsWaiting';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    id: 'execsExecuted',
    title: t('in-forge:plugins.host.dashboard.execsExecuted'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'cpu.execsExecuted';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    id: 'forksExecuted',
    title: t('in-forge:plugins.host.dashboard.forksExecuted'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'cpu.forksExecuted';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    id: 'processesStopped',
    title: t('in-forge:plugins.host.dashboard.processesStopped'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'cpu.processesStopped';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    id: 'processesSleeping',
    title: t('in-forge:plugins.host.dashboard.processesSleeping'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'cpu.processesSleeping';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    id: 'processesIdle',
    title: t('in-forge:plugins.host.dashboard.processesIdle'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'cpu.processesIdle';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    id: 'processesZombie',
    title: t('in-forge:plugins.host.dashboard.processesZombie'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'cpu.processesZombie';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function GlobalCpuProcessTable({ snapshot, timeConfig }) {
  const rows = [
    {
      key: 'global_cpu_processes',
      timeConfig,
      snapshotId: snapshot.get('id')
    }
  ];

  return (
    <Table
      cardTitle={t('in-forge:plugins.host.dashboard.CpuProcess')}
      withoutPadding
      cols={cols}
      rows={rows}
      maxItemsPerPage={1}
    />
  );
}
