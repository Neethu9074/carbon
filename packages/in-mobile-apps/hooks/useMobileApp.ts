/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MobileApp, Result } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import getMobileApp from 'in-mobile-apps/subscriptions/getMobileApp';
import { FetchedState } from 'in-hooks/utils/types';

export default function useMobileApp(mobileAppId: string): FetchedState<MobileApp> {
  const result: Result<MobileApp> | null | undefined = useObservable(
    () => getMobileApp({ id: mobileAppId }),
    [mobileAppId]
  );
  return resultToFetchedStateResponse(result);
}
