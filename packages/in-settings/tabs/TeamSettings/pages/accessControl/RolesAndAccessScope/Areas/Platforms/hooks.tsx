/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { GroupPermissionEntity } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { getAllKubernetesNamespacesForEntitySelectionWithDefaults } from 'in-kubernetes/subscriptions/getAllKubernetesNamespacesForEntitySelection';
import { getAllKubernetesClustersForEntitySelectionWithDefaults } from 'in-kubernetes/subscriptions/getAllKubernetesClustersForEntitySelection';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { FetchedState } from 'in-hooks/utils/types';
import useTimeConfig from 'in-hooks/useTimeConfig';

export const useKubernetesClustersConfigs = (): FetchedState<GroupPermissionEntity[]> => {
  const timeConfig = useTimeConfig();
  const result = useObservable(() => {
    return getAllKubernetesClustersForEntitySelectionWithDefaults({ timeConfig });
  }, [getAllKubernetesClustersForEntitySelectionWithDefaults]);
  return resultToFetchedStateResponse(result);
};

export const useKubernetesNamespacesConfigs = (): FetchedState<GroupPermissionEntity[]> => {
  const timeConfig = useTimeConfig();
  const result = useObservable(() => {
    return getAllKubernetesNamespacesForEntitySelectionWithDefaults({ timeConfig });
  }, [getAllKubernetesNamespacesForEntitySelectionWithDefaults]);
  return resultToFetchedStateResponse(result);
};
