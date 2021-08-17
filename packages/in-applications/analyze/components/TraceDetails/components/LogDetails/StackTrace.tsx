/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import getTraceActivityTreeNodeDetails from 'in-subscription/application/getTraceActivityTreeNodeDetails';
import { LOG_CALL_ID, LOG_TRACE_ID } from 'in-logging/queryBuilder';
import { pendingResult } from 'in-services/fixedObjects';
import { LogItem, LogTag } from 'in-types';

interface StackTraceProps {
  log: LogItem;
}

export default function StackTrace({ log }: StackTraceProps) {
  const traceId = getTraceId(log.tags);
  const callId = getCallId(log.tags);

  const callResult =
    useObservable(
      traceId && callId
        ? getTraceActivityTreeNodeDetails({
            traceId,
            nodeId: callId
          })
        : just(null),
      [traceId, callId]
    ) || pendingResult;

  console.log(callResult);

  return <span>{log.itemId}</span>;
}

function getTraceId(tags: LogTag[]): string | undefined {
  return tags.find(({ name }) => name === LOG_TRACE_ID)?.stringValue;
}

function getCallId(tags: LogTag[]): string | undefined {
  return tags.find(({ name }) => name === LOG_CALL_ID)?.stringValue;
}
