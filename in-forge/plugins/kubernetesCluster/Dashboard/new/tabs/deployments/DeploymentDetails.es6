import React from 'react';

import { DescriptionItem, DescriptionList } from 'in-components/DescriptionList';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import BackButton from 'in-sdk/components/dashboard/TabView/BackButton';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import Tooltip from 'in-components/Tooltip';
import Title from 'in-components/Title';
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
  //const {snapshot} = props;

  const snapshot = FakeData();

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

  const podRows = pods == null
    ? []
    : pods.toArray().map(pod => {
        return {
          key: `${pod.get('namespace')}:${pod.get('name')}`,
          name: pod.get('name'),
          labels: pod.get('labels'),
          namespace: pod.get('namespace')
        };
      });

  return (
    <div>
      <Title title="Deployment Details" />
      <BackButton label="Back to deployment list" href$={getSubDashboardLink(`/deployments`)} />

      <DashboardTile>
        <DescriptionList>
          <DescriptionItem title={`Deployment: ${name}`}>
            <Table cols={cols} rows={podRows} initialSortColumn={0} initialSortDirection="desc" />
          </DescriptionItem>
        </DescriptionList>
      </DashboardTile>
    </div>
  );
}
