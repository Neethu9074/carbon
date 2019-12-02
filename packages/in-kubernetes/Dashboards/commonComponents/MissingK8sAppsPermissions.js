import React from 'react';
import { get } from 'lodash';

import getKubernetesClusterByRelation$ from 'in-subscription/kubernetes/getKubernetesClusterByRelation';
import { Row, Col } from 'in-new-components/layout/Grid';
import Message from 'in-new-components/Message';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';
import theme from 'in-themes';

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
          <Message withIcon small type="warning" iconColor={theme.lib.colors.warning}>
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
          deploymentId: deploymentId,
          deploymentConfigId: deploymentConfigId,
          namespaceId: namespaceId,
          serviceId: serviceId,
          nodeId: nodeId,
          podId: podId,
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
