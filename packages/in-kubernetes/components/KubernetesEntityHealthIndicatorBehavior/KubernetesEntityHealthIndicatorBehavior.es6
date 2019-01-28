import KubernetesEntityHealthIndicator from 'in-kubernetes/components/KubernetesEntityHealthIndicatorBehavior/KubernetesEntityHealthIndicator';
import getKubernetesEntityHealthInfo from 'in-subscription/kubernetes/getKubernetesEntityHealthInfo';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(({ clusterId, namespaceId, deploymentId, podId, nodeId, timeConfig }) => {
  const healthInfo$ = getKubernetesEntityHealthInfo({
    filter: {
      clusterId,
      namespaceId,
      deploymentId,
      podId,
      nodeId,
      timeConfig
    }
  }).filter(healthInfo => healthInfo.data != null);

  return {
    openIssues: healthInfo$.map(result => result.data.openIssues.length),
    maxSeverity: healthInfo$.map(result => result.data.maxSeverity),
    timeConfig: healthInfo$.map(result => getTimeConfigAlignedToResultTime(timeConfig, result))
  };
}, KubernetesEntityHealthIndicator);
