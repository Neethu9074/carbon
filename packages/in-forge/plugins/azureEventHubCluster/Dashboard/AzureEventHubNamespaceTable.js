/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import getEventHubClusteredNamespaces from 'in-forge/plugins/azureEventHubCluster/namespaces/getEventHubClusteredNamespaces';
import { number, percentagePlainTwoDecimalPlaces } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.azureEventHubNamespace.labelName'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.azureEventHubNamespace.kpi.labelConnectionsActive'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'activeConnections';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.azureEventHubNamespace.kpi.labelNamespaceCpuUsages'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return 'namespaceCpuUsage';
      },
      getContent: percentagePlainTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => ({
    namespaces: timeConfig$
      .flatMap(timeConfig => getEventHubClusteredNamespaces({ snapshotId: props.snapshot.get('id'), timeConfig }))
      .flatMap(getSnapshots)
      .throttle(1000)
  }),

  function AzureEventHubNamespaceTable({ namespaces, timeConfig }) {
    if (namespaces == null || namespaces.length === 0) {
      return null;
    }

    const rows = namespaces.map(namespace => {
      return {
        key: namespace.get('id'),
        namespaceName: namespace.getIn(['data', 'name']),
        namespace,
        timeConfig
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.azureEventHubNamespace.namespaceWithCount', { len: rows.length })}
        cols={cols}
        rows={rows}
      />
    );
  }
);
