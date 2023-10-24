/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import StackTracePresentation from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/StackTrace/StackTracePresentation';
import { ParsedStackTrace } from 'in-components/Logging/TraceDetails/components/LogDetails/utils';
import { getSnapshot, isEntityOnline } from 'in-stores/snapshot';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import ExpandableGroup from 'in-components/ExpandableGroup';
import { ID_PROCESS } from 'in-logging/queryBuilder';
import { LogItem, LogTag } from 'in-types';
import { t } from 'in-i18n';

interface StackTraceProps {
  stackTrace?: ParsedStackTrace[] | null;
  log: LogItem;
}

export default function LogStackTraceGroup({ stackTrace, log }: StackTraceProps) {
  const snapshotId = getProcessSnapshotId(log.tags);
  const snapshot =
    useObservable(
      () => (snapshotId ? getSnapshot(snapshotId, getTimeConfigAtMoment(null)) : just(null)),
      [snapshotId]
    ) || null; // passing NULL, to get the snapshot from cache.

  const isSnapshotOnline =
    useObservable<boolean, (string | undefined)[]>(
      () => (snapshotId ? isEntityOnline(snapshotId) : just(false)),
      [snapshotId]
    ) || false;

  if (!stackTrace) {
    return null;
  }

  return (
    <ExpandableGroup title={t('in-analyze:traceDetail.components.callDetails.stackTrace')} defaultExpanded>
      <StackTracePresentation stackTrace={stackTrace} isOnline={isSnapshotOnline} snapshot={snapshot} noPadding />
    </ExpandableGroup>
  );
}

function getProcessSnapshotId(tags: LogTag[]): string | undefined {
  return tags.find(({ name }) => name === ID_PROCESS)?.stringValue;
}
