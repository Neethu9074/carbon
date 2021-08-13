/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

// @ts-ignore export for empty is missing in its *.d.ts files
import { empty, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import getWebsite from 'in-websites/subscriptions/getWebsite';
import { Result, Website } from 'in-types';

/**
 * Retrieves the name of a website for a given websiteId from backend
 *
 * @param {string} websiteId, optional
 * @returns the label for the website with the given websiteId or null, undefined if websiteId param is absent
 */
export default function useWebsiteLabel(websiteId?: string): string | null | undefined {
  return useObservable<string | undefined, [string | undefined]>(
    ([id]) => {
      if (!id) {
        return empty;
      }

      const website: Observable<Result<Website>> = getWebsite({ id });
      return website.map(({ data }) => data?.label);
    },
    [websiteId]
  );
}
