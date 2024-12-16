/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { isUndefined } from 'lodash';

import { Progress } from '@instana/components/types/util/dataRetrieval';
import { TimeConfig } from '@instana/types';

interface UseShowMissingDataIndicator {
  progress: Progress;
  timeConfig: TimeConfig;
  initialEvaluationTimestamp?: number;
  nonInteractive?: boolean;
}

export default function useShowMissingDataIndicator({
  progress,
  timeConfig,
  initialEvaluationTimestamp,
  nonInteractive
}: UseShowMissingDataIndicator): boolean {
  return !progress.loading && !nonInteractive && isCreatedWithinTimeWindow(timeConfig, initialEvaluationTimestamp);
}

function isCreatedWithinTimeWindow(timeConfig: TimeConfig, initialEvaluationTimestamp?: number): boolean {
  return (
    !isUndefined(initialEvaluationTimestamp) &&
    initialEvaluationTimestamp >= (timeConfig.to ?? Date.now()) - timeConfig.windowSize
  );
}
