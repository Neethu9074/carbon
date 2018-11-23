import getKubernetesEntityHealthInfo from 'in-subscription/kubernetes/getKubernetesEntityHealthInfo';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ clusterId, namespaceId, deploymentId, podId, nodeId, timeConfig }) => ({
    maxSeverity: getKubernetesEntityHealthInfo({
      filter: {
        clusterId,
        namespaceId,
        deploymentId,
        podId,
        nodeId,
        timeConfig
      }
    }).map(healthInfo => (healthInfo.data ? healthInfo.data.maxSeverity : null))
  }),
  function KubernetesSeverity({ maxSeverity, renderLink }) {
    return renderLink(maxSeverity);
  }
);
