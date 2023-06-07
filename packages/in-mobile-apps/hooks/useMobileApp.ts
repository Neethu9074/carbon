/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useObservable } from '@instana/hooks';

//@ts-expect-error TS migration
import getMobileApp from 'in-mobile-apps/subscriptions/getMobileApp';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { FetchedState } from 'in-hooks/utils/types';
import { MobileApp, Result } from 'in-types';

export default function useMobileApp(mobileAppId: string): FetchedState<MobileApp> {
  const result: Result<MobileApp> | null | undefined = useObservable(
    () => getMobileApp({ id: mobileAppId }),
    [mobileAppId]
  );
  return resultToFetchedStateResponse(result);
}
