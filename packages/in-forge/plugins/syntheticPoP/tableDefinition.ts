/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface Row {
  snapshotId: string;
  snapshot: any;
}

export default {
  initialSortColumn: 0,
  initialSortDirection: 'asc',

  cols: [
    {
      title: t('in-forge:plugins.syntheticPoP.name'),
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId(row: Row) {
          return row.snapshotId;
        }
      }
    },
    {
      title: t('in-forge:plugins.syntheticPoP.locationName'),
      type: 'string',
      typeArgs: {
        getValue(row: Row) {
          return row.snapshot.getIn(['data', 'properties.locationName']);
        }
      }
    },
    {
      title: t('in-forge:plugins.syntheticPoP.locationDisplayName'),
      type: 'string',
      typeArgs: {
        getValue(row: Row) {
          return row.snapshot.getIn(['data', 'properties.locationDisplayName']);
        }
      }
    },
    {
      title: t('in-forge:plugins.syntheticPoP.version'),
      type: 'string',
      typeArgs: {
        getValue(row: Row) {
          return row.snapshot.getIn(['data', 'properties.version']);
        }
      }
    },
    {
      title: t('in-forge:plugins.syntheticPoP.instanaSyntheticEndpoint'),
      type: 'string',
      typeArgs: {
        getValue(row: Row) {
          return row.snapshot.getIn(['data', 'properties.instanaSyntheticEndpoint']);
        }
      }
    },
    {
      title: t('in-forge:plugins.syntheticPoP.tenantType'),
      type: 'string',
      typeArgs: {
        getValue(row: Row) {
          return row.snapshot.getIn(['data', 'properties.tenantType']);
        }
      }
    },
    {
      title: t('in-forge:plugins.syntheticPoP.httpActive'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row: Row) {
          return row.snapshotId;
        },
        getMetricName() {
          return 'http.activeTests';
        },
        getContent: number.compact,
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    },
    {
      title: t('in-forge:plugins.syntheticPoP.javascriptActive'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row: Row) {
          return row.snapshotId;
        },
        getMetricName() {
          return 'javascript.activeTests';
        },
        getContent: number.compact,
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    },
    {
      title: t('in-forge:plugins.syntheticPoP.browserActive'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row: Row) {
          return row.snapshotId;
        },
        getMetricName() {
          return 'browserscript.activeTests';
        },
        getContent: number.compact,
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    },
    {
      title: t('in-forge:plugins.syntheticPoP.ismActive'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row: Row) {
          return row.snapshotId;
        },
        getMetricName() {
          return 'ism.activeTests';
        },
        getContent: number.compact,
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    }
  ]
};
