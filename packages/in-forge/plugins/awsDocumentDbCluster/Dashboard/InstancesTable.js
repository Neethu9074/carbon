/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { combineLatest } from '@instana/observables';

import { getClusterMembers } from 'in-sdk/clusterMembers';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.awsDocumentDbCluster.dashboard.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.awsDocumentDbCluster.dashboard.cpuUtilization'),
    type: 'sparkChart',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'cpu_utilization';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.awsDocumentDbCluster.dashboard.health'),
    type: 'health',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      clusterInstances: getClusterMembers(props.clusterSnapshotId)
        .flatMap(instances => combineLatest(instances.toArray().map(id => getSnapshot(id))))
        .throttle(1000)
    };
  },
  function ClusterInstanceTable({ clusterInstances, timeConfig }) {
    if (clusterInstances == null || clusterInstances.length === 0) {
      return null;
    }

    const rows = clusterInstances.map(instance => {
      return {
        key: instance.get('id'),
        instance,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.awsDocumentDbCluster.ClusterInstancesRows', { rows: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
