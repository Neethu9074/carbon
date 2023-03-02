/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { KubernetesNamespace, PaginatedResult } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { getKubernetesNamespacesWithDefaults } from 'in-kubernetes/subscriptions/getKubernetesNamespaces';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { FetchedState } from 'in-hooks/utils/types';
import useTimeConfig from 'in-hooks/useTimeConfig';

// This is using paginated fetching since at the moment of writing this code
// there was no endpoint to fetch all namespaces at once. It should be replaced once it is done
export const useKubernetesNamespacesConfigs = (): FetchedState<PaginatedResult<KubernetesNamespace>> => {
  const timeConfig = useTimeConfig();
  const result = useObservable(() => {
    return getKubernetesNamespacesWithDefaults({
      pageSize: 200,
      timeConfig
    });
  }, [getKubernetesNamespacesWithDefaults]);
  return resultToFetchedStateResponse(result);
};
