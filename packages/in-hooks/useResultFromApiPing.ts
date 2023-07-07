/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useState, useEffect, useRef } from 'react';

import { Disposable } from '@instana/observables';

import http from 'in-services/http/http';

export default function useResultFromApiPing({
  url,
  checkResult
}: {
  url: string;
  checkResult: (result: any) => boolean;
}) {
  const [apiCallSatisfied, setApiCallSatisfied] = useState(false);
  let fetchLaterHandle: NodeJS.Timeout | undefined;
  const subscription = useRef<Disposable>();
  const disposeTimeout = () => {
    if (fetchLaterHandle) {
      clearTimeout(fetchLaterHandle);
      fetchLaterHandle = undefined;
    }
    subscription.current?.dispose();
  };

  const tryFetchEnvironmentStatus = () => {
    disposeTimeout();
    fetchLaterHandle = setTimeout(fetchEnvironmentStatus, 2 * 1000);
  };

  const fetchEnvironmentStatus = () => {
    const result$ = http({
      method: 'GET',
      maxRetries: 3,
      url
    }).map(response => response.body);

    subscription.current = result$.once(result => {
      const shouldRetry = !checkResult(result);
      if (shouldRetry) {
        tryFetchEnvironmentStatus();
      } else {
        setApiCallSatisfied(true);
      }
    });

    // ignore HTTP errors silently and try again later
    result$.errors().once(tryFetchEnvironmentStatus);
  };

  useEffect(() => {
    fetchEnvironmentStatus();
    return disposeTimeout;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return apiCallSatisfied;
}
