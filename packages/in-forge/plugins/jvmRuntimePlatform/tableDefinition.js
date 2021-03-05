/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { bytesTwoDecimalPlaces, timeByMicroTwoDecimalPlaces } from 'in-services/formatters/number';

export default {
  initialSortColumn: 0,
  initialSortDirection: 'asc',

  cols: [
    {
      title: t('in-forge:plugins.jvmRuntimePlatform.name'),
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        }
      }
    },
    {
      title: t('in-forge:plugins.jvmRuntimePlatform.javaVersion'),
      type: 'string',
      typeArgs: {
        getValue(row) {
          return row.snapshot.getIn(['data', 'jvm.version']) + ' ' + row.snapshot.getIn(['data', 'jvm.build']);
        }
      }
    },
    {
      title: t('in-forge:plugins.jvmRuntimePlatform.javaRuntime'),
      type: 'string',
      typeArgs: {
        getValue(row) {
          return row.snapshot.getIn(['data', 'jvm.vendor']) + ' ' + row.snapshot.getIn(['data', 'jvm.name']);
        }
      }
    },
    {
      title: t('in-forge:plugins.jvmRuntimePlatform.maxHeap'),
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
      title: t('in-forge:plugins.jvmRuntimePlatform.heapUsed'),
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
    },
    {
      title: t('in-forge:plugins.jvmRuntimePlatform.suspension'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        },
        getMetricName() {
          return 'suspension.time';
        },
        getContent: timeByMicroTwoDecimalPlaces,
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    }
  ]
};
