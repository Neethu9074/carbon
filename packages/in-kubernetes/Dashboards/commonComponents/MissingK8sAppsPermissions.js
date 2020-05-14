import { get } from 'lodash';
import React from 'react';

import getKubernetesClusterByRelation$ from 'in-subscription/kubernetes/getKubernetesClusterByRelation';
import { warning } from 'in-new-components/Message/types';
import { Row, Col } from 'in-new-components/layout/Grid';
import Message from 'in-new-components/Message';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

export default function MissingK8sAppsPermissions(props) {
  if (props.cluster) {
    return <WarningMessage missingAppsPermissions={get(props.cluster, ['missingAppsPermissions'])} />;
  } else {
    return <WarningMessageAfterFetchingCluster props={props} />;
  }
}

function WarningMessage(props) {
  if (props.missingAppsPermissions) {
    return (
      <Row>
        <Col lg={12}>
          <Message type={warning} withIcon small>
            The Instana Agent does not have sufficient permissions. Please update to the latest version of the Instana
            Agent DaemonSet or Helm chart to ensure it has the right permissions. See our{' '}
            <Link href="https://docs.instana.io/ecosystem/kubernetes/#supported-versions" external>
              documentation
            </Link>{' '}
            for more information.
          </Message>
        </Col>
      </Row>
    );
  }
  return null;
}

const WarningMessageAfterFetchingCluster = connectTo(
  props => {
    const { deploymentId, deploymentConfigId, namespaceId, serviceId, nodeId, podId, timeConfig } = props.props;
    return {
      cluster: getKubernetesClusterByRelation$({
        filter: {
          resourceSnapshotId: deploymentId || deploymentConfigId || namespaceId || serviceId || nodeId || podId,
          timeConfig: timeConfig
        }
      })
    };
  },
  function WarningMessageAfterFetchingCluster({ cluster }) {
    const missingAppsPermissions = cluster && get(cluster, ['data', 'missingAppsPermissions']);
    return <WarningMessage missingAppsPermissions={missingAppsPermissions} />;
  }
);
