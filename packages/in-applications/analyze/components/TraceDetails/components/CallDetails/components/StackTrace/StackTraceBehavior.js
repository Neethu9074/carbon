/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { useObservable } from '@instana/hooks';

import StackTracePresentation from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/StackTrace/StackTracePresentation';
import StackTraceWrapper from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/StackTrace/StackTraceWrapper';
import { getSnapshot, isEntityOnline } from 'in-stores/snapshot';
import { getTimeConfigAtMoment } from 'in-stores/time/config';

export default function StackTrace(props) {
  const { stackTrace, relation } = props;
  const snapshotId = get(relation, ['physicalContext', 'process', 'id']);
  const isOnline = snapshotId ? isEntityOnline(snapshotId) : false;
  const snapshot = useObservable(snapshotId ? getSnapshot(snapshotId, getTimeConfigAtMoment(null)) : null, [
    snapshotId
  ]); // passing NULL, to get the snapshot from cache.
  if (!stackTrace || !snapshotId) {
    return null;
  }
  return (
    <StackTraceWrapper>
      <StackTracePresentation {...props} snapshot={snapshot} isOnline={isOnline} />
    </StackTraceWrapper>
  );
}
