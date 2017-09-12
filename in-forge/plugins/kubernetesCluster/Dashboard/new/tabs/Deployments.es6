import React from 'react';
import Tooltip from 'in-components/Tooltip';
import { compare } from 'in-services/util/boolean';
import Table from 'in-sdk/components/dashboard/Table';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';

const cols = [
  {
    title: 'Name',
    type: 'custom',
    typeArgs: {
      comparator: compare,
      get(row) {
        return {
          value: row.name,
          content: (
            <Tooltip content={wrapTooltipElement(row.labels)} align={'rightMiddle'}>
              <span>{row.name}</span>
            </Tooltip>
          )
        };
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
    title: 'Replicas / Available replicas',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.replicas;
      }
    }
  }
];

function wrapTooltipElement(deploymentLabels) {
  const labels = deploymentLabels.toJS();
  return (
    <span>
      {Object.keys(labels).map(key => {
        return <div key={key}>{`${key} : ${labels[key]}`}</div>;
      })}
    </span>
  );
}

export default function Deployments({ snapshot }) {
  const deployments = snapshot.getIn(['data', 'deployments']).toArray();
  const deploymentRows = deployments.map(deployment => {
    return {
      key: deployment.get('name'),
      name: deployment.get('name'),
      labels: deployment.get('labels'),
      replicas: `${deployment.get('replicas')} / ${deployment.get('availableReplicas')}`,
      namespace: deployment.get('namespace')
    };
  });

  return (
    <MaxWidthFullscreenContainer>
      <DashboardTile title={`Deployments (${deployments.length})`}>
        <Table cols={cols} rows={deploymentRows} initialSortColumn={0} initialSortDirection="desc" />
      </DashboardTile>
    </MaxWidthFullscreenContainer>
  );
}
