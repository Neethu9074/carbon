import { get } from 'lodash';

import getKubernetesIdsForBreadcrumb$ from 'in-subscription/kubernetes/getKubernetesIdsForBreadcrumb';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    resolvedIdsResult: getKubernetesIdsForBreadcrumb$({
      filter: {
        deploymentId: props.deploymentId,
        deploymentConfigId: props.deploymentConfigId,
        namespaceId: props.namespaceId,
        clusterId: props.clusterId,
        serviceId: props.serviceId,
        nodeId: props.nodeId,
        podId: props.podId,
        timeConfig: props.timeConfig
      }
    })
  }),
  function KubernetesIdsForBreadcrumb(props) {
    return props.renderBreadcrumbs(
      get(props.resolvedIdsResult, ['data', 'clusterId']),
      get(props.resolvedIdsResult, ['data', 'namespaceId']),
      get(props.resolvedIdsResult, ['data', 'deploymentId'])
    );
  }
);
