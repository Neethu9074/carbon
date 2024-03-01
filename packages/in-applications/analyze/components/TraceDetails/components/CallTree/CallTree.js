/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useLimitVisibleNestingLevels } from 'in-applications/analyze/components/TraceDetails/components/CallTree/hooks/useLimitVisibleNestingLevels';
import { isParenWithHiddenNestingLevel } from 'in-applications/analyze/components/TraceDetails/components/CallTree/callTrees';
import TreeHeader from 'in-applications/analyze/components/TraceDetails/components/CallTree/components/TreeHeader';
import { getStart, getEnd } from 'in-applications/analyze/components/TraceDetails/components/callStartAndEndTime';
import LoadingCallTree from 'in-applications/analyze/components/TraceDetails/components/CallTree/LoadingCallTree';
import { isLazyNode } from 'in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree';
import Row from 'in-applications/analyze/components/TraceDetails/components/CallTree/components/Row';
import { getCallIdFromTags, getSpanIdFromTags } from 'in-components/Logging/TraceDetails/utils';
import { useLogsInCallsContext } from 'in-components/Logging/TraceDetails/LogsInCallsContext';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import { isLoading } from 'in-services/util/result';
import createScale from 'in-services/scale';

import locals from './CallTree.mless';

// We are reusing this scale object for every render operation. We are doing this because we want to avoid
// excessive creation of scale objects. These scale objects would also interfere with change detection
// mechanisms.
// Warning: This code will break when we want to show two call trees concurrently (which is not on the roadmap)
const scale = createScale();

export default function CallTree({
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
  onCallCollapsed,
  traceSummary
}) {
  if (isLoading(callTreeResult)) {
    return <LoadingCallTree progress={callTreeResult.progress} />;
  }

  const hasErrors = callTreeResult.errors.length > 0;
  if (hasErrors) {
    return <ErroneousResultPresenter errors={callTreeResult.errors} />;
  }

  return (
    <LoadedCallTree
      callTreeResult={callTreeResult}
      getColor={getColor}
      openedCallId={openedCallId}
      onCallClicked={onCallClicked}
      onSubCallClicked={onSubCallClicked}
      isLargeTrace={isLargeTrace}
      selectedCall$={selectedCall$}
      onRelatedCallsLoaded={onRelatedCallsLoaded}
      onParentAndSiblingCallsLoaded={onParentAndSiblingCallsLoaded}
      expandedCalls={expandedCalls}
      onCallExpanded={onCallExpanded}
      onCallCollapsed={onCallCollapsed}
      traceSummary={traceSummary}
    />
  );
}

function LoadedCallTree({
  callTreeResult,
  getColor,
  openedCallId,
  onCallClicked,
  onSubCallClicked,
  isLargeTrace,
  selectedCall$,
  onRelatedCallsLoaded,
  onParentAndSiblingCallsLoaded,
  expandedCalls,
  onCallExpanded,
  onCallCollapsed,
  traceSummary
}) {
  const { items: loggingLogItems } = useLogsInCallsContext();

  const [rootNode, onShowHiddenParentNestingLevel, onShowHiddenChildNestingLevel] = useLimitVisibleNestingLevels(
    callTreeResult,
    openedCallId
  );

  const logsInVisibleCalls = getLogsInVisibleCalls(rootNode, loggingLogItems);

  const start = getStart(rootNode, logsInVisibleCalls);
  const end = getEnd(rootNode, logsInVisibleCalls);

  scale.setRangeFrom(0);
  scale.setRangeTo(100);
  scale.setDomainFrom(start);
  scale.setDomainTo(end);

  return (
    <div className={locals.callTree}>
      <TreeHeader
        traceSummary={traceSummary}
        rootCall={rootNode}
        isLazyOrHiddenParent={isLazyNode(rootNode) || isParenWithHiddenNestingLevel(rootNode)}
      />
      <Row
        call={rootNode}
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
        onShowHiddenParentNestingLevel={onShowHiddenParentNestingLevel}
        onShowHiddenChildNestingLevel={onShowHiddenChildNestingLevel}
      />
    </div>
  );
}

export function getLogsInVisibleCalls(call, logs) {
  if (!call || !logs || !Array.isArray(logs)) return [];

  let ids = [];
  function getCallIds(call) {
    if (call.id) {
      ids.push(call.id);
    }

    if (call.children && call.children.length > 0) {
      call.children.forEach(child => {
        getCallIds(child);
      });
    }
  }

  getCallIds(call);

  return logs.filter(log => ids.includes(getSpanIdFromTags(log.tags) || getCallIdFromTags(log.tags)));
}
