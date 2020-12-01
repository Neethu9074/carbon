import { get } from 'lodash';
import React from 'react';

import getKubernetesClusterByRelation$ from 'in-subscription/kubernetes/getKubernetesClusterByRelation';
import { agentMonitoringIssuesEnabled } from 'in-services/featureFlags';
import { warning } from 'in-new-components/Message/types';
import { Row, Col } from 'in-new-components/layout/Grid';
import Message from 'in-new-components/Message';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

export default function MissingK8sPermissions(props) {
  if (agentMonitoringIssuesEnabled) {
    return null;
  }

  if (props.cluster) {
    return <WarningMessage debuggingInfo={get(props.cluster, ['debuggingInfo'])} />;
  } else {
    return <WarningMessageAfterFetchingCluster props={props} />;
  }
}

function WarningMessage(props) {
  if (props.debuggingInfo && props.debuggingInfo['Missing Resource Watches'] !== 'None') {
    return (
      <Row>
        <Col lg={12}>
          <Message type={warning} withIcon small>
            The Instana Agent is missing permissions for {props.debuggingInfo['Missing Resource Watches']}. Please
            update to the latest version of the Instana Agent YAML, Helm chart or Operator to ensure it has the right
            permissions. See our{' '}
            <Link
              href="https://instana.com/docs/setup_and_manage/host_agent/on/kubernetes/#current-versions-of-installation-methods"
              external
            >
              Kubernetes
            </Link>{' '}
            or{' '}
            <Link
              href="https://instana.com/docs/setup_and_manage/host_agent/on/openshift/#current-versions-of-installation-methods"
              external
            >
              OpenShift
            </Link>{' '}
            documentation for more information.
          </Message>
        </Col>
      </Row>
    );
  }
  return null;
}

const WarningMessageAfterFetchingCluster = connectTo(
  props => {
    const { resourceSnapshotId, timeConfig } = props.props;
    return {
      cluster: getKubernetesClusterByRelation$({
        filter: {
          resourceSnapshotId: resourceSnapshotId,
          timeConfig: timeConfig
        }
      })
    };
  },
  function WarningMessageAfterFetchingCluster({ cluster }) {
    const debuggingInfo = cluster && get(cluster, ['data', 'debuggingInfo']);
    return <WarningMessage debuggingInfo={debuggingInfo} />;
  }
);
