/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { zeroDecimalPlaces, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import { t } from 'in-i18n';

export default {
  initialSortColumn: 0,
  initialSortDirection: 'asc',

  cols: [
    {
      title: t('in-forge:plugins.beeInstana.table.host'),
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId$(row) {
          return getHostSnapshotId(row.snapshot);
        }
      }
    },
    {
      title: t('in-forge:plugins.beeInstana.table.name'),
      type: 'snapshotLink',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        }
      }
    },
    {
      title: t('in-forge:plugins.beeInstana.table.metrics'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.snapshotId;
        },
        getMetricName(row) {
          const label = row.snapshot.getIn(['data', 'label']);

          if (label === 'ingestor') {
            return 'Ingestor.AggregatorFlushByTimeAndPartition.NumOfMetrics.sum';
          } else {
            return 'Aggregator.AggregatorStats.NumMetricsWithData.max';
          }
        },
        getContent: zeroDecimalPlaces,
        getTimeWindowAggregation() {
          return 'max';
        }
      }
    },
    {
      title: t('in-forge:plugins.beeInstana.table.cpu'),
      type: 'metric',
      typeArgs: {
        getSnapshotId$(row) {
          return getHostSnapshotId(row.snapshot);
        },
        getMetricName() {
          return 'cpu.used';
        },
        getContent: percentageZeroDecimalPlaces,
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    },
    {
      title: t('in-forge:plugins.beeInstana.table.memory'),
      type: 'metric',
      typeArgs: {
        getSnapshotId$(row) {
          return getHostSnapshotId(row.snapshot);
        },
        getMetricName() {
          return 'memory.used';
        },
        getContent: percentageZeroDecimalPlaces,
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    }
  ]
};
