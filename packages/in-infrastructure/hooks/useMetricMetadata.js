/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';

import { pendingResult } from 'in-services/fixedObjects';

export default function useMetricMetadata({ getMetricMetadata, type, metric }) {
  return useObservable(() => getMetricMetadata({ type, metric }), [getMetricMetadata, type, metric]) ?? pendingResult;
}
