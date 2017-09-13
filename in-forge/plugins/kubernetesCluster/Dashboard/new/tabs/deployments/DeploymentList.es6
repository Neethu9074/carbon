import React from 'react';
import Tooltip from 'in-components/Tooltip';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';

const cols = [
  {
    title: 'Name',
    type: 'link',
    typeArgs: {
      comparator: compareIgnoreCase,
      showLoadingIndicator: true,
      get$(row) {
        const href$ = getSubDashboardLink(
          `/deployments/${encodeURIComponent(row.key)}&${encodeURIComponent(row.snapshotId)}`
        );

        return href$.map(href => {
          return {
            label: (
              <Tooltip content={wrapTooltipElement(row.labels)} align={'rightMiddle'}>
                <span>{row.name}</span>
              </Tooltip>
            ),
            value: row.name,
            href
          };
        });
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
      <h5>Labels</h5>
      {Object.keys(labels).map(key => {
        return <div key={key}>{`${key} : ${labels[key]}`}</div>;
      })}
    </span>
  );
}

export default function DeploymenList({ snapshot }) {
  const deployments = snapshot.getIn(['data', 'deployments']).toArray();
  const deploymentRows = deployments.map(deployment => {
    return {
      key: deployment.get('name'),
      name: deployment.get('name'),
      labels: deployment.get('labels'),
      replicas: `${deployment.get('replicas')} / ${deployment.get('availableReplicas')}`,
      namespace: deployment.get('namespace'),
      snapshotId: snapshot.get('id')
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
