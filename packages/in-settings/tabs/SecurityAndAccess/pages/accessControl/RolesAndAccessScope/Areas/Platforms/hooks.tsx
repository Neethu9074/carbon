/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { GroupPermissionEntity } from '@instana/types';
import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import { getAllOtelKubernetesClustersForEntitySelectionWithDefaults } from 'in-kubernetes/subscriptions/getAllOtelKubernetesClustersForEntitySelection';
import { getAllKubernetesNamespacesForEntitySelectionWithDefaults } from 'in-kubernetes/subscriptions/getAllKubernetesNamespacesForEntitySelection';
import { getAllKubernetesClustersForEntitySelectionWithDefaults } from 'in-kubernetes/subscriptions/getAllKubernetesClustersForEntitySelection';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { pendingResult } from 'in-services/fixedObjects';
import { FetchedState } from 'in-hooks/utils/types';
import useTimeConfig from 'in-hooks/useTimeConfig';

export const useKubernetesClustersConfigs = () => {
  const timeConfig = useTimeConfig();
  const result = useObservable(() => {
    return getAllKubernetesClustersForEntitySelectionWithDefaults({ timeConfig });
  }, [getAllKubernetesClustersForEntitySelectionWithDefaults]);
  return resultToFetchedStateResponse(result);
};

export const useOtelKubernetesClustersConfigs = () => {
  const timeConfig = useTimeConfig();
  const result = useObservable(() => {
    return getAllOtelKubernetesClustersForEntitySelectionWithDefaults({ timeConfig });
  }, [getAllOtelKubernetesClustersForEntitySelectionWithDefaults]);
  return resultToFetchedStateResponse(result);
};

export const useCombinedKubernetesClustersConfigs = () => {
  const timeConfig = useTimeConfig();
  const events = [
    getAllKubernetesClustersForEntitySelectionWithDefaults({ timeConfig }),
    getAllOtelKubernetesClustersForEntitySelectionWithDefaults({ timeConfig })
  ];
  const result =
    useObservable(
      combineLatest(events)
        .throttle(500)
        .map(([k8s, otel]): any => ({
          k8s,
          otel
        })),
      [useKubernetesClustersConfigs, useOtelKubernetesClustersConfigs]
    ) ?? pendingResult;
  return result;
};

export const useKubernetesNamespacesConfigs = (): FetchedState<GroupPermissionEntity[]> => {
  const timeConfig = useTimeConfig();
  const result = useObservable(() => {
    return getAllKubernetesNamespacesForEntitySelectionWithDefaults({ timeConfig });
  }, [getAllKubernetesNamespacesForEntitySelectionWithDefaults]);
  return resultToFetchedStateResponse(result);
};
