/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { bytesTwoDecimalPlaces, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';

export default {
  initialSortColumn: 0,
  initialSortDirection: 'asc',
  cols: [
    {
      title: t('in-forge:plugins.containerd.titleHost'),
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId$(row) {
          return getHostSnapshotId(row.snapshot);
        }
      }
    },
    {
      title: t('in-forge:plugins.containerd.titleName'),
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        }
      }
    },
    {
      title: t('in-forge:plugins.containerd.titleCreated'),
      type: 'dateTime',
      typeArgs: {
        getValue(row) {
          return row.snapshot.getIn(['data', 'createdAt']);
        }
      }
    },
    {
      title: t('in-forge:plugins.containerd.titleUpdated'),
      type: 'dateTime',
      typeArgs: {
        getValue(row) {
          return row.snapshot.getIn(['data', 'updatedAt']);
        }
      }
    },
    {
      title: t('in-forge:plugins.containerd.titleCPUUsage'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        },
        getMetricName() {
          return 'cpu.total_usage';
        },
        getContent: percentageZeroDecimalPlaces,
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    },
    {
      title: t('in-forge:plugins.containerd.titleMemoryUsage'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        },
        getMetricName() {
          return 'memory.usage';
        },
        getContent: bytesTwoDecimalPlaces,
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    }
  ]
};
