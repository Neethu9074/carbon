import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import Tooltip from 'in-components/Tooltip';

import FakeData from './FakeData';

const cols = [
  {
    title: 'Name',
    type: 'link',
    typeArgs: {
      comparator: compareIgnoreCase,
      showLoadingIndicator: true,
      get$(row) {
        const href$ = getSubDashboardLink(`/deployments/${encodeURIComponent(row.key)}`);

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
    title: 'Available Replicas / Desirbed Replicas',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.replicas;
      }
    }
  }
];

function wrapTooltipElement(deploymentLabels) {
  const labels = deploymentLabels == null ? [] : deploymentLabels.toJS();
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
  //TODO: remove me
  snapshot = FakeData();

  const deploymentSnapshotList = snapshot.getIn(['data', 'deployments', 'data']);
  const itemIds = snapshot.getIn(['data', 'deployments', 'itemIds']).toJS();
  const deployments = deploymentSnapshotList == null ? [] : deploymentSnapshotList.toArray();

  const deploymentRows = deployments
    .filter(deployment => {
      //this could possible be deleted in the future, once the backend is able to filter for deployments that are
      //not available anymore
      const desiredItemId = `${deployment.get('namespace')}:${deployment.get('name')}`;
      return itemIds.indexOf(desiredItemId) !== -1;
    })
    .map(deployment => {
      return {
        key: `${deployment.get('namespace')}:${deployment.get('name')}`,
        name: deployment.get('name'),
        labels: deployment.get('labels'),
        replicas: `${deployment.get('availableReplicas')} / ${deployment.get('replicas')}`,
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
