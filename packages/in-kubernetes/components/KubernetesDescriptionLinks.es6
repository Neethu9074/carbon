import React, { Fragment } from 'react';

import {
  getNamespaceDashboard,
  getPodDashboard,
  getDeploymentDashboard,
  getClusterDashboard,
  getNodeDashboard
} from 'in-kubernetes/navigation/paths';
import { DescriptionItem } from 'in-components/DescriptionList';
import { kubernetesEnabled } from 'in-services/featureFlags';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { getLabel } from 'in-sdk/snapshot';
import Link from 'in-components/Link';

import locals from './KubernetesDescriptionLinks.mless';

export default function KubernetesDescriptionLinks({
  linkToDashboards,
  deploymentSnapshot,
  deploymentConfig,
  nodeSnapshot,
  hostSnapshot,
  clusterSnapshot,
  namespaceSnapshot,
  podSnapshot,
  defaultNamespaceContent
}) {
  if (kubernetesEnabled && linkToDashboards) {
    return (
      <Fragment>
        {deploymentSnapshot && (
          <DescriptionItem title="Deplyoment">
            <KubernetesV2Link getDashboard={getDeploymentDashboard} snapshot={deploymentSnapshot} />
          </DescriptionItem>
        )}
        {deploymentConfig && (
          <DescriptionItem title="Deployment Config">
            <SnapshotLink snapshotId={deploymentConfig.get('id')}>{getLabel(deploymentConfig)}</SnapshotLink>
          </DescriptionItem>
        )}
        {podSnapshot && (
          <DescriptionItem title="Pod">
            <KubernetesV2Link getDashboard={getPodDashboard} snapshot={podSnapshot} />
          </DescriptionItem>
        )}
        {nodeSnapshot && (
          <DescriptionItem title="Node">
            <KubernetesV2Link getDashboard={getNodeDashboard} snapshot={nodeSnapshot} />
          </DescriptionItem>
        )}
        {hostSnapshot && (
          <DescriptionItem title="Host">
            <SnapshotLink snapshotId={hostSnapshot.get('id')}>{getLabel(hostSnapshot)}</SnapshotLink>
          </DescriptionItem>
        )}
        {clusterSnapshot && (
          <DescriptionItem title="Cluster">
            <KubernetesV2Link getDashboard={getClusterDashboard} snapshot={clusterSnapshot} />
          </DescriptionItem>
        )}
        {namespaceSnapshot ? (
          <DescriptionItem title="Namespace">
            <KubernetesV2Link getDashboard={getNamespaceDashboard} snapshot={namespaceSnapshot} />
          </DescriptionItem>
        ) : (
          defaultNamespaceContent
        )}
      </Fragment>
    );
  }

  return (
    <Fragment>
      {deploymentSnapshot && (
        <DescriptionItem title="Deplyoment">
          <SnapshotLink snapshotId={deploymentSnapshot.get('id')}>{getLabel(deploymentSnapshot)}</SnapshotLink>
        </DescriptionItem>
      )}
      {deploymentConfig && (
        <DescriptionItem title="Deployment Config">
          <SnapshotLink snapshotId={deploymentConfig.get('id')}>{getLabel(deploymentConfig)}</SnapshotLink>
        </DescriptionItem>
      )}
      {podSnapshot && (
        <DescriptionItem title="Pod">
          <SnapshotLink snapshotId={podSnapshot.get('id')}>{getLabel(podSnapshot)}</SnapshotLink>
        </DescriptionItem>
      )}
      {nodeSnapshot && (
        <DescriptionItem title="Node">
          <SnapshotLink snapshotId={nodeSnapshot.get('id')}>{getLabel(nodeSnapshot)}</SnapshotLink>
        </DescriptionItem>
      )}
      {hostSnapshot && (
        <DescriptionItem title="Host">
          <SnapshotLink snapshotId={hostSnapshot.get('id')}>{getLabel(hostSnapshot)}</SnapshotLink>
        </DescriptionItem>
      )}
      {clusterSnapshot && (
        <DescriptionItem title="Cluster">
          <SnapshotLink snapshotId={clusterSnapshot.get('id')}>{getLabel(clusterSnapshot)}</SnapshotLink>
        </DescriptionItem>
      )}
      {namespaceSnapshot ? (
        <DescriptionItem title="Namespace">
          <SnapshotLink snapshotId={namespaceSnapshot.get('id')}>{getLabel(namespaceSnapshot)}</SnapshotLink>
        </DescriptionItem>
      ) : (
        defaultNamespaceContent
      )}
    </Fragment>
  );
}

function KubernetesV2Link({ getDashboard, snapshot }) {
  return (
    <Link className={locals.link} href$={getDashboard(snapshot.get('id'))}>
      {getLabel(snapshot)}
    </Link>
  );
}
