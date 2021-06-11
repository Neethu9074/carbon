/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';
import { empty } from '@instana/observables';

import getApplication from 'in-subscription/application/getApplication';

/**
 * Returns the name of an application for a given applicationId.
 *
 * @param {string} applicationId
 * @param {boolean} isGlobalSmartAlert
 * @returns the label for the application with the given application or undefined if applicationId or isGlobalSmartAlert param is absent.
 */
export default function useApplicationLabel(applicationId, isGlobalSmartAlert) {
  const applicationLabel = useObservable(() => {
    if (isGlobalSmartAlert || !applicationId) {
      return empty;
    }
    return getApplication({ id: applicationId }).map(({ data }) => data?.label);
  }, [applicationId]);

  return applicationLabel;
}
