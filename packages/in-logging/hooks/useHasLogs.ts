/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';

import { TagFilterExpression, TimeConfig } from 'in-types';
import hasLogs from 'in-logging/subscriptions/hasLogs';

interface UseHasLogsRequest {
  timeConfig: TimeConfig;
  tagFilterExpression: TagFilterExpression;
}

export default function useHasLogs({ tagFilterExpression, timeConfig }: UseHasLogsRequest): boolean | undefined {
  const hasLogsResult = useObservable<boolean, [number | null | undefined, number]>(
    () =>
      hasLogs({
        timeConfig,
        tagFilterExpression
      }).map(result => result.data?.hasLogs || false),
    [timeConfig.to, timeConfig.windowSize]
  );
  return hasLogsResult === undefined || hasLogsResult === null ? undefined : hasLogsResult;
}
