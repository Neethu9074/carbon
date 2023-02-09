/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { bytesTwoDecimalPlaces, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import { t } from 'in-i18n';

export default {
  initialSortColumn: 0,
  initialSortDirection: 'asc',
  cols: [
    {
      title: t('in-forge:plugins.podman.host'),
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId$(row) {
          return getHostSnapshotId(row.snapshot);
        }
      }
    },
    {
      title: t('in-forge:plugins.podman.name'),
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        }
      }
    },
    {
      title: t('in-forge:plugins.podman.created'),
      type: 'dateTime',
      typeArgs: {
        getValue(row) {
          return row.snapshot.getIn(['data', 'created']);
        }
      }
    },
    {
      title: t('in-forge:plugins.podman.cpuUsage'),
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
      title: t('in-forge:plugins.podman.memoryUsage'),
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
