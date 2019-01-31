import { get } from 'lodash';

import getKubernetesClusterAndNamespace from 'in-subscription/kubernetes/getKubernetesClusterAndNamespace';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    resolvedIdsResult: getKubernetesClusterAndNamespace({
      filter: {
        deploymentId: props.deploymentId,
        namespaceId: props.namespaceId,
        clusterId: props.clusterId,
        serviceId: props.serviceId,
        nodeId: props.nodeId,
        podId: props.podId,
        timeConfig: props.timeConfig
      }
    })
  }),
  function ClusterAndNamespaceIds(props) {
    return props.renderBreadcrumbs(
      get(props.resolvedIdsResult, ['data', 'clusterId']),
      get(props.resolvedIdsResult, ['data', 'namespaceId'])
    );
  }
);
