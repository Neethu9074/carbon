/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytesTwoDecimalPlaces, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';

export default {
  initialSortColumn: 0,
  initialSortDirection: 'asc',

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
      title: 'State',
      type: 'string',
      typeArgs: {
        getValue(row) {
          return row.snapshot.getIn(['data', 'state']);
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
          return 'cpu.total';
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
        getContent(value) {
          return bytesTwoDecimalPlaces(value);
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
          return 'network.rxBytes';
        },
        getContent(value) {
          return bytesTwoDecimalPlaces(value);
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
          return 'network.txBytes';
        },
        getContent(value) {
          return bytesTwoDecimalPlaces(value);
        },
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    }
  ]
};
