/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default {
  initialSortColumn: 0,
  initialSortDirection: 'asc',

  cols: [
    {
      title: t('in-forge:plugins.dropwizardApplicationContainer.app'),
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
      title: t('in-forge:plugins.dropwizardApplicationContainer.retrievedMessages'),
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
      title: t('in-forge:plugins.dropwizardApplicationContainer.traceSubscribeEvents'),
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
