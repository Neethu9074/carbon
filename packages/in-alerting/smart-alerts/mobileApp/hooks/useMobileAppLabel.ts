/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error export for empty is missing in its *.d.ts files
import { empty, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

//@ts-expect-error needs TS migration
import getMobileApp from 'in-mobile-apps/subscriptions/getMobileApp';
import { Result, MobileApp } from 'in-types';

/**
 * Retrieves the name of a mobileApp for a given mobileAppId from backend
 *
 * @param {string} mobileAppId, optional
 * @returns the label for the mobileApp with the given mobileAppId or null, undefined if mobileAppId param is absent
 */
export default function useMobileAppLabel(mobileAppId?: string): string | null | undefined {
  return useObservable<string | undefined, [string | undefined]>(
    ([id]) => {
      if (!id) {
        return empty;
      }

      const mobileApp: Observable<Result<MobileApp>> = getMobileApp({ id });
      return mobileApp.map(({ data }) => data?.label);
    },
    [mobileAppId]
  );
}
