/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { percentageTwoDecimalPlaces, msTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import ImageAndLabel from 'in-sdk/components/table/ImageAndLabel';
import { getPluginName } from 'in-sdk/pluginName';

export default [
  {
    title: t('in-forge:plugins.kubernetesCluster.type'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return getPluginName(row.snapshot.get('plugin'), 1);
      },
      getContent(val, row) {
        return <ImageAndLabel snapshot={row.snapshot}>{val}</ImageAndLabel>;
      }
    }
  },
  {
    title: t('in-forge:plugins.kubernetesCluster.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshot;
      }
    }
  },
  {
    title: t('in-forge:plugins.kubernetesCluster.calls'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'count';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: t('in-forge:plugins.kubernetesCluster.avgLatency'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'duration.mean';
      },
      getContent: msTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kubernetesCluster.errorRate'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'error_rate';
      },
      getContent: percentageTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.kubernetesCluster.instances'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'instances';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];
