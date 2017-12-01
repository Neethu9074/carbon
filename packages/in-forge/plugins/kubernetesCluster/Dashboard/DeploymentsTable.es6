import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getClusterMembers } from 'in-stores/clusterMembers';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshots } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { number, millis } from 'in-services/formatters/number';

const cols = [
  {
    title: 'Name',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      }
    }
  },
  {
    title: 'Namespace',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.namespace;
      }
    }
  },
  {
    title: 'Available Replicas',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return `availableReplicas`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Desired Replicas',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return `desiredReplicas`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Rollout duration',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.key;
      },
      getMetricName() {
        return `duration`;
      },
      getContent: millis.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      deployments: getClusterMembers(props.snapshot.get('id')).flatMap(deploymentIds =>
        getSnapshots(deploymentIds.toArray())
      )
    };
  },

  function DeploymentsTable({ snapshot, deployments = [], timeframe }) {
    const rows = deployments
      .filter(deployment => deployment.get('plugin') == 'kubernetesDeployment')
      .map(deployment => {
        const data = deployment.get('data');
        return {
          key: deployment.get('id'),
          name: data.get('name'),
          namespace: data.get('namespace'),
          labels: data.get('labels'),
          snapshotId: snapshot.get('id'),
          timeframe
        };
      });

    return (
      <DashboardSection title={`Deployments (${rows.length})`}>
        <Table cols={cols} rows={rows} />
      </DashboardSection>
    );
  }
);
