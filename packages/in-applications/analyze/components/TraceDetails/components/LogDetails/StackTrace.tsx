/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

// @ts-ignore
import StackTracePresentation from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/StackTrace/StackTracePresentation';
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

  const stackTrace = callResult?.data?.logs?.[0]?.stackTrace;
  if (stackTrace) {
    return (
      <ExpandableGroup title="Stacktrace" defaultExpanded>
        <StackTracePresentation stackTrace={stackTrace} isOnline={false} snapshot={null} noPadding />
      </ExpandableGroup>
    );
  }

  return <span>{log.itemId}</span>;
}

function getTraceId(tags: LogTag[]): string | undefined {
  return tags.find(({ name }) => name === LOG_TRACE_ID)?.stringValue;
}

function getCallId(tags: LogTag[]): string | undefined {
  return tags.find(({ name }) => name === LOG_CALL_ID)?.stringValue;
}

import ExpandableGroup from 'in-components/ExpandableGroup';
