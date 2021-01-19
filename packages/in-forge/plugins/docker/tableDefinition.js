/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytesTwoDecimalPlaces, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import { hasNetworkMetrics, hasMemoryMetrics } from 'in-forge/plugins/docker/util';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';

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
      title: 'Host',
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId$(row) {
          return getHostSnapshotId(row.snapshot);
        }
      }
    },
    {
      title: 'Name',
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        }
      }
    },
    {
      title: 'Created',
      type: 'dateTime',
      typeArgs: {
        getValue(row) {
          return row.snapshot.getIn(['data', 'Created']);
        }
      }
    },
    {
      title: 'Started',
      type: 'dateTime',
      typeArgs: {
        getValue(row) {
          return row.snapshot.getIn(['data', 'Started']);
        }
      }
    },
    {
      title: 'CPU Usage',
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
      title: 'Memory Usage',
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
      title: 'Network received',
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
      title: 'Network transmitted',
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
