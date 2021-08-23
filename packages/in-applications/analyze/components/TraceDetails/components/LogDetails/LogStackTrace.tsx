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
import { LOG_CALL_ID, LOG_PROCESS_SNAPSHOT_ID, LOG_TRACE_ID } from 'in-logging/queryBuilder';
// @ts-ignore
import { isEntityOnline, getSnapshot } from 'in-stores/snapshot';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import ExpandableGroup from 'in-components/ExpandableGroup';
import { pendingResult } from 'in-services/fixedObjects';
import { LogItem, LogTag } from 'in-types';
import { t } from 'in-i18n';

interface StackTraceProps {
  log: LogItem;
}

export default function LogStackTraceGroup({ log }: StackTraceProps) {
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

  const snapshotId = getProcessSnapshotId(log.tags);
  const snapshot =
    useObservable(() => (snapshotId ? getSnapshot(snapshotId, getTimeConfigAtMoment(null)) : just(null)), [
      snapshotId
    ]) || null; // passing NULL, to get the snapshot from cache.

  const isSnapshotOnline =
    useObservable(() => (snapshotId ? isEntityOnline(snapshotId) : just(false)), [snapshotId]) || false;

  const stackTrace = callResult?.data?.logs?.[0]?.stackTrace;
  if (!stackTrace) {
    return null;
  }

  return (
    <ExpandableGroup title={t('in-analyze:traceDetail.components.callDetails.stackTrace')} defaultExpanded>
      <StackTracePresentation stackTrace={stackTrace} isOnline={isSnapshotOnline} snapshot={snapshot} noPadding />
    </ExpandableGroup>
  );
}

function getTraceId(tags: LogTag[]): string | undefined {
  return tags.find(({ name }) => name === LOG_TRACE_ID)?.stringValue;
}

function getCallId(tags: LogTag[]): string | undefined {
  return tags.find(({ name }) => name === LOG_CALL_ID)?.stringValue;
}

function getProcessSnapshotId(tags: LogTag[]): string | undefined {
  return tags.find(({ name }) => name === LOG_PROCESS_SNAPSHOT_ID)?.stringValue;
}
