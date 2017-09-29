import { combineLatest } from 'reactive-observables';
import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { getClusterMembers } from 'in-stores/clusterMembers';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshot } from 'in-stores/snapshot';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';

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
    title: 'Actual / Desired Replicas',
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

export default connectTo(
  props => {
    return {
      deployments: getClusterMembers(props.snapshot.get('id'))
        // Always start with an empty set to avoid inconsistent view,
        // displaying running components for a previously selected snapshot.
        .flatMap(nodeIds => combineLatest(nodeIds.toArray().map(id => getSnapshot(id).startWith(null))))
        .map(x => x.filter(y => y != null))
        .throttle(1000)
        .startWith([])
    };
  },
  function DeploymenList({ snapshot, deployments }) {
    const deploymentRows = deployments
      .filter(deployment => deployment.get('plugin') == 'kubernetesDeployment')
      .map(deployment => deployment.get('data'))
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
        <DashboardTile title={`Deployments (${deploymentRows.length})`}>
          <Table cols={cols} rows={deploymentRows} initialSortColumn={0} initialSortDirection="desc" />
        </DashboardTile>
      </MaxWidthFullscreenContainer>
    );
  }
);
