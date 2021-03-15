/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytesTwoDecimalPlaces, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import { hasNetworkMetrics, hasMemoryMetrics } from 'in-forge/plugins/docker/util';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import { t } from 'in-i18n';

export default {
  initialSortColumn: 0,
  initialSortDirection: 'asc',
  preProcessRows(rows) {
    rows.forEach(row => {
      row.hasNetworkMetrics = hasNetworkMetrics(row.snapshot);
      row.hasMemoryMetrics = hasMemoryMetrics(row.snapshot);
    });
  },

  cols: [
    {
      title: t('in-forge:plugins.docker.host'),
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId$(row) {
          return getHostSnapshotId(row.snapshot);
        }
      }
    },
    {
      title: t('in-forge:plugins.docker.name'),
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        }
      }
    },
    {
      title: t('in-forge:plugins.docker.created'),
      type: 'dateTime',
      typeArgs: {
        getValue(row) {
          return row.snapshot.getIn(['data', 'Created']);
        }
      }
    },
    {
      title: t('in-forge:plugins.docker.started'),
      type: 'dateTime',
      typeArgs: {
        getValue(row) {
          return row.snapshot.getIn(['data', 'Started']);
        }
      }
    },
    {
      title: t('in-forge:plugins.docker.cpuUsage'),
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
      title: t('in-forge:plugins.docker.memoryUsage'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        },
        getMetricName() {
          return 'memory.usage';
        },
        getContent(value, row) {
          if (row.hasMemoryMetrics) {
            return bytesTwoDecimalPlaces(value);
          }
          return 'N/A';
        },
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    },
    {
      title: t('in-forge:plugins.docker.networkReceived'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        },
        getMetricName() {
          return 'network.rx.bytes';
        },
        getContent(value, row) {
          if (row.hasNetworkMetrics) {
            return bytesTwoDecimalPlaces(value);
          }
          return 'N/A';
        },
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    },
    {
      title: t('in-forge:plugins.docker.networkTransmitted'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        },
        getMetricName() {
          return 'network.tx.bytes';
        },
        getContent(value, row) {
          if (row.hasNetworkMetrics) {
            return bytesTwoDecimalPlaces(value);
          }
          return 'N/A';
        },
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    }
  ]
};
