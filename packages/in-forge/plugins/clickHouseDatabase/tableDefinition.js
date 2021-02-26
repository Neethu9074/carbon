/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import { emptyList } from 'in-services/fixedImmutables';
import { number } from 'in-services/formatters/number';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';

export default {
  initialSortColumn: 0,
  initialSortDirection: 'asc',
  getChartLabel$: snapshot =>
    getHostSnapshotId(snapshot)
      .flatMap(getSnapshot)
      .map(getLabel),

  cols: [
    {
      title: t('in-forge:plugins.clickhouseDatabase.titleHost'),
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId$(row) {
          return getHostSnapshotId(row.snapshot);
        }
      }
    },
    {
      title: t('in-forge:plugins.clickhouseDatabase.titleDatabase'),
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        }
      }
    },
    {
      title: t('in-forge:plugins.clickhouseDatabase.titleClusters'),
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
      title: t('in-forge:plugins.clickhouseDatabase.titleHTTPConnections'),
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
      title: t('in-forge:plugins.clickhouseDatabase.titleQueries'),
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
      title: t('in-forge:plugins.clickhouseDatabase.titleMerges'),
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
