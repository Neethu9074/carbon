/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { rbacTeamsEnabled } from 'in-services/featureFlags';
import { pendingResult } from 'in-services/fixedObjects';
import { getTeamsAvailableProbe } from 'in-api/teams';
import { FetchedState } from 'in-hooks/utils/types';
import { success } from 'in-services/util/result';

/**
 * Hook to check if the Teams functionality is available in the system.
 *
 * This hook performs a two-step verification:
 * 1. Checks if the `rbacTeamsEnabled` feature flag is enabled
 * 2. If enabled, probes the Teams API endpoints to verify they are available
 *
 * Note: After deployment, it can take up to 6 hours for the Teams API endpoints
 * to become available even when the feature flag is enabled.
 *
 * @returns {FetchedState<boolean>} A fetched state object containing:
 *   - `data`: boolean indicating if Teams functionality is available
 *   - `loading`: boolean indicating if the check is in progress
 *   - `error`: any error that occurred during the check
 */
export default function useIsTeamsAvailable(): FetchedState<boolean> {
  const result =
    useObservable(() => {
      if (!rbacTeamsEnabled) return just(success(false));
      return getTeamsAvailableProbe();
    }, [rbacTeamsEnabled]) ?? pendingResult;

  return resultToFetchedStateResponse(result);
}
