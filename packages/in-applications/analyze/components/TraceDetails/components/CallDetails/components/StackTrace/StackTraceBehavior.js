/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import StackTracePresentation from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/StackTrace/StackTracePresentation';
import StackTraceWrapper from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/StackTrace/StackTraceWrapper';
import { isEntityOnline, getSnapshot } from 'in-stores/snapshot';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(({ relation, stackTrace }) => {
  const snapshotId = get(relation, ['physicalContext', 'process', 'id']);
  if (stackTrace == null || snapshotId == null) {
    return {};
  }
  return {
    isOnline: isEntityOnline(snapshotId),
    snapshot: getSnapshot(snapshotId, getTimeConfigAtMoment(null)) // passing NULL, to get the snapshot from cache.
  };
})(StackTrace);

function StackTrace(props) {
  if (!props.stackTrace) {
    return null;
  }

  return (
    <StackTraceWrapper>
      <StackTracePresentation {...props} />
    </StackTraceWrapper>
  );
}
