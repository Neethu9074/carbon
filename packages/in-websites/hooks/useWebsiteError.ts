/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useObservable } from '@instana/hooks';

import getWebsiteError from 'in-websites/subscriptions/getWebsiteError';
import { TimeConfig, JavaScriptError, Result } from 'in-types';
import { pendingResult } from 'in-services/fixedObjects';
import { alwaysNull } from 'in-services/fixedStreams';

export default function useWebsiteError(
  websiteId: string,
  errorId: string,
  timeConfig: TimeConfig
): Result<JavaScriptError> {
  const result =
    useObservable(
      errorId
        ? () =>
            getWebsiteError({
              websiteId,
              timeConfig,
              errorId
            })
        : alwaysNull,
      [websiteId, errorId, timeConfig]
    ) ?? pendingResult;

  return result;
}
