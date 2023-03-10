/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import TreeHeader from 'in-applications/analyze/components/TraceDetails/components/CallTree/components/TreeHeader';
import { getStart, getEnd } from 'in-applications/analyze/components/TraceDetails/components/callStartAndEndTime';
import LoadingCallTree from 'in-applications/analyze/components/TraceDetails/components/CallTree/LoadingCallTree';
import Row2 from 'in-applications/analyze/components/TraceDetails/components/CallTree/components/Row2';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import { isLoading } from 'in-services/util/result';
import createScale from 'in-services/scale';

import locals from './CallTree.mless';

// We are reusing this scale object for every render operation. We are doing this because we want to avoid
// excessive creation of scale objects. These scale objects would also interfere with change detection
// mechanisms.
// Warning: This code will break when we want to show two call trees concurrently (which is not on the roadmap)
const scale = createScale();

export default function CallTree2({
  callTreeResult,
  getColor = () => '#e6e6e6',
  openedCallId,
  onCallClicked,
  onSubCallClicked,
  isLargeTrace,
  selectedCall$,
  onRelatedCallsLoaded,
  onParentAndSiblingCallsLoaded,
  expandedCalls,
  onCallExpanded,
  onCallCollapsed
}) {
  if (isLoading(callTreeResult)) {
    return <LoadingCallTree progress={callTreeResult.progress} />;
  }

  const hasErrors = callTreeResult.errors.length > 0;
  if (hasErrors) {
    return <ErroneousResultPresenter errors={callTreeResult.errors} />;
  }

  const rootCall = callTreeResult.data;

  const start = getStart(rootCall);
  const end = getEnd(rootCall);

  scale.setRangeFrom(0);
  scale.setRangeTo(100);
  scale.setDomainFrom(start);
  scale.setDomainTo(end);

  return (
    <div className={locals.callTree}>
      <TreeHeader rootCall={rootCall} scale={scale} />
      <Row2
        call={rootCall}
        getColor={getColor}
        scale={scale}
        isLargeTrace={isLargeTrace}
        onCallClicked={onCallClicked}
        onSubCallClicked={onSubCallClicked}
        selectedCall$={selectedCall$}
        openedCallId={openedCallId}
        onParentAndSiblingCallsLoaded={onParentAndSiblingCallsLoaded}
        onRelatedCallsLoaded={onRelatedCallsLoaded}
        expandedCalls={expandedCalls}
        onCallExpanded={onCallExpanded}
        onCallCollapsed={onCallCollapsed}
      />
    </div>
  );
}
