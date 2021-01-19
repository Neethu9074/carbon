/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default {
  initialSortColumn: 0,
  initialSortDirection: 'asc',

  cols: [
    {
      title: 'App',
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        }
      }
    },
    // {
    //   title: 'Environment',
    //   type: 'string',
    //   typeArgs: {
    //     getValue(row) {
    //       return getTenantUnitCoordinates(row.snapshot).environment;
    //     }
    //   }
    // },
    // {
    //   title: 'Tenant',
    //   type: 'string',
    //   typeArgs: {
    //     getValue(row) {
    //       return getTenantUnitCoordinates(row.snapshot).tenant;
    //     }
    //   }
    // },
    // {
    //   title: 'Unit',
    //   type: 'string',
    //   typeArgs: {
    //     getContent(row) {
    //       return getTenantUnitCoordinates(row.snapshot).unit;
    //     }
    //   }
    // },
    {
      title: 'Retrieved Messages',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        },
        getMetricName() {
          return 'metrics.meters.KPI.ws.retrievedMessages';
        },
        getContent: number.compact,
        getTimeWindowAggregation() {
          return 'sum';
        }
      }
    },
    {
      title: 'Trace Subscribe Events',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        },
        getMetricName() {
          return 'metrics.counters.active.subscriptions: TracesSubscribeEvent';
        },
        getContent: number.compact,
        getTimeWindowAggregation() {
          return 'sum';
        }
      }
    }
  ]
};
