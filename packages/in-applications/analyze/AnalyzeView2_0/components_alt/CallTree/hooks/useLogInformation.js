/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { isLoading, hasError } from 'in-services/util/result';
import { minutes } from 'in-services/time';

const timeWindowExtend = minutes.toMillis(10);

export default function useLogInformation(trace, callTreeResult) {
  const totalNumberOfLogs = countLogs(callTreeResult);

  const timeConfigForLogs = {
    to: trace.startTime + timeWindowExtend,
    windowSize: trace.duration + timeWindowExtend * 2,
    focusedMoment: trace.startTime + timeWindowExtend,
    autoRefresh: false
  };

  return { totalNumberOfLogs, timeConfigForLogs };
}

function countLogs(callTreeResult) {
  if (isLoading(callTreeResult) || hasError(callTreeResult)) {
    return 0;
  }
  return countLogsForCall(callTreeResult.data);
}

function countLogsForCall(call, counter = 0) {
  if (call.model === 'LOG') {
    counter++;
  }
  if (call.children) {
    call.children.forEach(subCall => (counter += countLogsForCall(subCall)));
  }
  return counter;
}
