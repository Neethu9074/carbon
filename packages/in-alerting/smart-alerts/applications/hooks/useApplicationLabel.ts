/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

// @ts-ignore export for empty is missing
import { empty } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import getApplication from 'in-applications/subscriptions/getApplication';

/**
 * Returns the name of an application for a given applicationId.
 *
 * @param {string} applicationId
 * @param {boolean} isGlobalSmartAlert
 * @returns the label for the application with the given application or undefined if applicationId or isGlobalSmartAlert param is absent.
 */
export default function useApplicationLabel(applicationId: string, isGlobalSmartAlert: boolean): string | unknown {
  const applicationLabel = useObservable(() => {
    if (isGlobalSmartAlert || !applicationId) {
      return empty;
    }
    return getApplication({ id: applicationId }).map(({ data }) => data?.label);
  }, [applicationId]);

  return applicationLabel;
}
