import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';

export default [
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
    title: 'Java Version',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'jvm.version']) + ' ' + row.snapshot.getIn(['data', 'jvm.build']);
      }
    }
  },
  {
    title: 'Java Runtime',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'jvm.vendor']) + ' ' + row.snapshot.getIn(['data', 'jvm.name']);
      }
    }
  },
  {
    title: 'Max Heap',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.snapshot.getIn(['data', 'memory.max']);
      },
      getContent(val) {
        return bytesTwoDecimalPlaces(val);
      }
    }
  },
  {
    title: 'Heap Used',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'memory.used';
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];
