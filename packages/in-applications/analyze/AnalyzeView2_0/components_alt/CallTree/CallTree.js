/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState, useMemo, useEffect } from 'react';

import { useObservable } from '@instana/hooks';

import { getStart, getEnd } from 'in-applications/analyze/components/TraceDetails/components/callStartAndEndTime';
import TreeHeader from 'in-applications/analyze/AnalyzeView2_0/components_alt/CallTree/components/TreeHeader';
import LoadingCallTree from 'in-applications/analyze/AnalyzeView2_0/components_alt/CallTree/LoadingCallTree';
import Row from 'in-applications/analyze/AnalyzeView2_0/components_alt/CallTree/components/Row';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import { isLoading, hasError } from 'in-services/util/result';
import createScale from 'in-services/scale';

export default function ResultAwareCallTree(props) {
  const { callTreeResult } = props;

  if (isLoading(callTreeResult)) {
    return <LoadingCallTree progress={callTreeResult.progress} />;
  }

  if (hasError(callTreeResult)) {
    return <ErroneousResultPresenter errors={callTreeResult.errors} />;
  }

  return <CallTree {...props} />;
}

function CallTree(props) {
  const {
    openedCallId,
    callTreeResult,
    expandCollapseSignal$,
    initialExpandAllCalls,
    getColor = () => '#e6e6e6'
  } = props;
  const rootCall = callTreeResult.data;

  const [expandedCallIds, setExpandedCallIds] = useState(null);

  // changing the openedCallId should NOT result in a recalculation
  useMemo(
    () =>
      setExpandedCallIds(
        initialExpandAllCalls ? collectAllIds(rootCall) : collectInitialExpandedCallIds(rootCall, openedCallId)
      ),
    [rootCall?.id]
  );

  const signal = useObservable(
    expandCollapseSignal$.map(command => ({ command })),
    [],
    { pure: false }
  );
  useEffect(() => {
    if (signal?.command === 'expand') {
      setExpandedCallIds(collectAllIds(rootCall));
    } else if (signal?.command === 'collapse') {
      setExpandedCallIds(expandedCallIds && expandedCallIds.size > 0 ? new Set([rootCall.id]) : null);
    }
  }, [signal]);

  const start = getStart(rootCall);
  const end = getEnd(rootCall);

  const [scale] = useState(createScale());
  scale.setRangeFrom(0);
  scale.setRangeTo(100);
  scale.setDomainFrom(start);
  scale.setDomainTo(end);

  return (
    <>
      <TreeHeader rootCall={rootCall} scale={scale} />
      <Row
        {...props}
        call={rootCall}
        getColor={getColor}
        scale={scale}
        expandedCallIds={expandedCallIds}
        expandCall={call => setExpandedCallIds(combine(expandedCallIds, new Set([call.id])))}
        collapseCall={call => {
          setExpandedCallIds(intersect(expandedCallIds, collectAllIds(call)));
        }}
      />
    </>
  );
}

function collectInitialExpandedCallIds(rootCall, openedCallId) {
  const ids = new Set();
  markNode(rootCall, openedCallId, ids);
  return ids;
}

function markNode(treeNode, openedCallId, ids) {
  if (!treeNode || !openedCallId) {
    return;
  }
  if (treeNode.id === openedCallId) {
    return ids.add(treeNode.id);
  }

  for (const childNode of treeNode.children) {
    if (markNode(childNode, openedCallId, ids)) {
      ids.add(treeNode.id);
    }
  }
  return ids.has(treeNode.id);
}

function collectAllIds(rootCall) {
  const ids = new Set();
  getIds(rootCall, ids);
  return ids;
}

function getIds(call, ids) {
  ids.add(call.id);
  for (const subCall of call.children) {
    getIds(subCall, ids);
  }
}

function combine(setA, setB) {
  return new Set([...setA, ...setB]);
}

function intersect(setA, setB) {
  const copy = new Set([...setA]);
  setB.forEach(copy.delete, copy);
  return copy;
}
