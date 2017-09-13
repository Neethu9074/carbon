import React from 'react';

import { DescriptionItem, DescriptionList } from 'in-components/DescriptionList';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getDockerSnapshotIdByContainerId } from 'in-stores/snapshot/graph';
import BackButton from 'in-sdk/components/dashboard/TabView/BackButton';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { getDashboardLink } from 'in-stores/navigation/navigation';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshot } from 'in-stores/snapshot';
import Tooltip from 'in-components/Tooltip';
import { getLabel } from 'in-sdk/snapshot';
import Title from 'in-components/Title';

const cols = [
  {
    title: 'Name',
    type: 'custom',
    typeArgs: {
      comparator: compareIgnoreCase,
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

export default function DeploymentDetails(props) {
  const deploymentId = decodeURIComponent(props.match.params.deploymentId);
  const { snapshot } = props;

  //const snapshot = FakeData();

  if (!deploymentId) {
    //todo: do something better here
    return null;
  }

  const deployment = snapshot.getIn(['data', 'deployments', 'data', deploymentId]);
  const name = deployment.get('name');
  const deploymentUid = deployment.get('uid');

  const replicaset = snapshot.getIn(['data', 'replicaSets', 'data']).find(replicaset => {
    const owners = replicaset.get('owners');
    if (owners) {
      const uid = owners.get('Deployment');
      if (deploymentUid === uid) {
        return true;
      }
    }
    return false;
  });

  const replicasetUid = replicaset.get('uid');

  const pods = snapshot
    .getIn(['data', 'pods', 'data'])
    .filter(pod => {
      const owners = pod.get('owners');
      if (owners) {
        const replUid = owners.get('ReplicaSet');
        if (replUid === replicasetUid) {
          return true;
        }
      }
      return false;
    })
    .valueSeq();

  const podRows = pods.toArray().map(pod => {
    return {
      key: `${pod.get('namespace')}:${pod.get('name')}`,
      name: pod.get('name'),
      labels: pod.get('labels'),
      namespace: pod.get('namespace'),
      pod
    };
  });

  return (
    <div>
      <Title title="Deployment Details" />
      <BackButton label="Back to deployment list" href$={getSubDashboardLink(`/deployments`)} />

      <DashboardTile title="Deployment">
        <DescriptionList>
          <DescriptionItem title="Name">
            {name}
          </DescriptionItem>
        </DescriptionList>
      </DashboardTile>

      <DashboardTile title={`Pods (${podRows.length})`}>
        <Table
          cols={cols}
          rows={podRows}
          initialSortColumn={0}
          getRowDetails={getRowDetails}
          initialSortDirection="desc"
        />
      </DashboardTile>
    </div>
  );
}

function getRowDetails(row) {
  const { pod } = row;
  const containers = pod.get('containers');
  const data = containers.get('data');

  const cols = [
    {
      title: 'Name',
      type: 'link',
      typeArgs: {
        comparator: compareIgnoreCase,
        showLoadingIndicator: true,
        get$(row) {
          return getDockerSnapshotIdByContainerId(row.imageId)
            .flatMap(snapshotId => getSnapshot(snapshotId))
            .flatMap(snapshot =>
              getDashboardLink(snapshot.get('snapshotId')).map(href => {
                return { href, snapshot };
              })
            )
            .map(({ snapshot, href }) => {
              return {
                label: getLabel(snapshot),
                value: getLabel(snapshot),
                href
              };
            })
            .startWith({
              label: row.key,
              value: row.key,
              href: undefined
            });
        }
      }
    }
  ];

  const rows = data.toArray().map(container => {
    const imageId = container.get('id', '').replace(/docker:\/\//i, '');
    const uid = container.get('uid');
    return {
      key: uid,
      imageId
    };
  });

  return (
    <DashboardSection title="Containers">
      <Table cols={cols} rows={rows} initialSortColumn={0} initialSortDirection="desc" />
    </DashboardSection>
  );
}
