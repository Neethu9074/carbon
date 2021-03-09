/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import { millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default {
  initialSortColumn: 0,
  initialSortDirection: 'asc',

  cols: [
    {
      title: t('in-forge:plugins.ping.label'),
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        }
      }
    },
    {
      title: t('in-forge:plugins.ping.type'),
      type: 'string',
      typeArgs: {
        getValue(row) {
          return row.snapshot.getIn(['data', 'type']);
        }
      }
    },
    {
      title: t('in-forge:plugins.ping.source'),
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId$(row) {
          return getHostSnapshotId(row.snapshot);
        }
      }
    },
    {
      title: t('in-forge:plugins.ping.target'),
      type: 'string',
      typeArgs: {
        getValue(row) {
          return row.snapshot.getIn(['data', 'target']);
        }
      }
    },
    {
      title: t('in-forge:plugins.ping.duration'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        },
        getMetricName() {
          return 'duration';
        },
        getContent: millis.fixedCompact,
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    }
  ]
};
