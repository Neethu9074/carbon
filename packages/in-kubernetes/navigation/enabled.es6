import getKubernetesMonitoringState from 'in-subscription/kubernetes/getKubernetesMonitoringState';
import { kubernetesEnabled } from 'in-services/featureFlags';
import { timeConfig$ } from 'in-stores/time/config';

export const kubernetesEnabled$ = timeConfig$
  .flatMap(timeConfig => getKubernetesMonitoringState({ timeConfig }))
  .map(result => (result.data && result.data.monitored) || kubernetesEnabled);
