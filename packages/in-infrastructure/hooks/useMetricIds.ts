/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Result, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';

import getMetricIds from 'in-infrastructure/subscriptions/getMetricIds';
import { pendingResult } from 'in-services/fixedObjects';

export interface UseMetricIdsOptions {
  snapshotId: string;
  timeConfig: TimeConfig;
}

export default function useMetricIds({ snapshotId, timeConfig }: UseMetricIdsOptions): Result<string[]> {
  return useObservable(getMetricIds({ snapshotId, timeConfig }), [snapshotId, timeConfig]) ?? pendingResult;
}
