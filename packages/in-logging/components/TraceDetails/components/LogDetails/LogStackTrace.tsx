/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import StackTracePresentation from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/StackTrace/StackTracePresentation';
import { getSnapshot, isEntityOnline } from 'in-stores/snapshot';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { StackTraceItem } from 'in-types';
import { t } from 'in-i18n';

interface StackTraceProps {
  stackTrace: StackTraceItem[];
  processSnapshotId?: string;
}
export default function LogStackTraceGroup({ stackTrace, processSnapshotId }: StackTraceProps) {
  const timeConfig = useTimeConfig();

  const snapshot = useObservable(
    () => (processSnapshotId ? getSnapshot(processSnapshotId, timeConfig) : just(null)),
    [processSnapshotId, timeConfig]
  );

  const isSnapshotOnline =
    useObservable<boolean, (string | undefined)[]>(
      () => (processSnapshotId ? isEntityOnline(processSnapshotId) : just(false)),
      [processSnapshotId]
    ) || false;

  return (
    <>
      <Typography variant="heading-02">{t('in-analyze:traceDetail.components.callDetails.stackTrace')}</Typography>
      <StackTracePresentation stackTrace={stackTrace} isOnline={isSnapshotOnline} snapshot={snapshot} noPadding />
    </>
  );
}
