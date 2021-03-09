/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { time, bytesTwoDecimalPlaces, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default {
  initialSortColumn: 0,
  initialSortDirection: 'asc',

  cols: [
    {
      title: t('in-forge:plugins.nodeJsRuntimePlatform.app'),
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        }
      }
    },
    {
      title: t('in-forge:plugins.nodeJsRuntimePlatform.heapUsed'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        },
        getMetricName() {
          return 'memory.heapUsed';
        },
        getContent: bytesTwoDecimalPlaces,
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    },
    {
      title: t('in-forge:plugins.nodeJsRuntimePlatform.gcPauseS'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        },
        getMetricName() {
          return 'gc.gcPause';
        },
        getContent: timeByMillisTwoDecimalPlaces,
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    },
    {
      title: t('in-forge:plugins.nodeJsRuntimePlatform.eventLoopLag'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        },
        getMetricName() {
          return 'libuv.lag';
        },
        getContent: time,
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    }
  ]
};
