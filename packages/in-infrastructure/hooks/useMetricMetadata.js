/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { emptyObject, pendingResult } from 'in-services/fixedObjects';

export default function useMetricMetadata({ getMetricMetadata, type, metric }) {
  return (
    useObservable(() => {
      if (!type || !metric) {
        return just(emptyObject);
      }
      return getMetricMetadata({ type, metric });
    }, [getMetricMetadata, type, metric]) ?? pendingResult
  );
}
