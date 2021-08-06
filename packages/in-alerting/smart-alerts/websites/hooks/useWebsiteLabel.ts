/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';
import { empty } from '@instana/observables';

import getWebsite from 'in-websites/subscriptions/getWebsite';

/**
 * Returns the name of a website for a given websiteId.
 *
 * @param {string} websiteId
 * @returns the label for the website with the given websiteId or undefined if websiteId param is absent.
 */
export default function useWebsiteLabel(websiteId) {
  const websiteLabel = useObservable(() => {
    if (!websiteId) {
      return empty;
    }

    return getWebsite({ id: websiteId }).map(({ data }) => data?.label);
  }, [websiteId]);

  return websiteLabel;
}
