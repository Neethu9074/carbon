/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';

import getApplication from 'in-applications/subscriptions/getApplication';
import { Nullish } from 'in-types';

/**
 * Returns the name of an application for a given applicationId.
 *
 * @param {string} applicationId
 * @param {boolean} isGlobalSmartAlert
 * @returns the label for the application with the given application or undefined if applicationId or isGlobalSmartAlert param is absent.
 */
export default function useApplicationLabel(applicationId: string, isGlobalSmartAlert: boolean): string | Nullish {
  const applicationLabel: string | Nullish = useObservable(() => {
    if (isGlobalSmartAlert || !applicationId) {
      return null;
    }
    return getApplication({ id: applicationId }).map(({ data }) => data?.label);
  }, [applicationId]);

  return applicationLabel;
}
