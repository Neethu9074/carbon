import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import { emptyList } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';

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
      title: 'Database',
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        }
      }
    },
    {
      title: 'Clusters',
      type: 'string',
      typeArgs: {
        getValue(row) {
          return row.snapshot
            .getIn(['data', 'clusters'], emptyList)
            .sort()
            .join(', ');
        }
      }
    },
    {
      title: 'HTTP Connections',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        },
        getMetricName() {
          return 'HTTPConnection';
        },
        getContent: number.compact,
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    },
    {
      title: 'Queries',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        },
        getMetricName() {
          return 'Query';
        },
        getContent: number.compact,
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    },
    {
      title: 'Merges',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        },
        getMetricName() {
          return 'Merge';
        },
        getContent: number.compact,
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    }
  ]
};
