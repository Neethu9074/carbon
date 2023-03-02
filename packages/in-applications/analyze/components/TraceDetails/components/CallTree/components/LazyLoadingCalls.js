/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { LoadingSkeleton } from '@instana/components';

import { useLoadLazyRelatedCalls } from 'in-applications/analyze/components/TraceDetails/components/CallTree/hooks/useLoadLazyRelatedCalls';
import { useLoadLazyParentNode } from 'in-applications/analyze/components/TraceDetails/components/CallTree/hooks/useLoadLazyParentNode';
import { isLazyParentNode } from 'in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree';
import CallTreeHeader from 'in-applications/analyze/AnalyzeView2_0/components/CallTreeHeader';
import { t } from 'in-i18n';

import locals from './LazyLoadingCalls.mless';

export function LazyLoadingCalls({ lazyNode, onParentAndSiblingCallsLoaded, onRelatedCallsLoaded }) {
  return isLazyParentNode(lazyNode) ? (
    <LazyParentAndSiblingCalls
      lazyParentNode={lazyNode}
      onParentAndSiblingCallsLoaded={onParentAndSiblingCallsLoaded}
    />
  ) : (
    <LazyRelatedCalls lazyNode={lazyNode} onRelatedCallsLoaded={onRelatedCallsLoaded} />
  );
}

function LazyParentAndSiblingCalls({ lazyParentNode, onParentAndSiblingCallsLoaded }) {
  const [startLoading, setStartLoading] = useState(false);
  useLoadLazyParentNode({ lazyParentNode, onParentAndSiblingCallsLoaded, startLoading, setStartLoading });
  return <LoadButtonOrSkeleton startLoading={startLoading} setStartLoading={setStartLoading} parent />;
}

function LazyRelatedCalls({ lazyNode, onRelatedCallsLoaded }) {
  const { cursor } = lazyNode;
  const autoLoadInitialChildBatch = !cursor || cursor.offset === 0;
  const [startLoading, setStartLoading] = useState(autoLoadInitialChildBatch);
  useLoadLazyRelatedCalls({ lazyNode, onRelatedCallsLoaded, startLoading, setStartLoading });
  return <LoadButtonOrSkeleton startLoading={startLoading} setStartLoading={setStartLoading} />;
}

function LoadButtonOrSkeleton({ startLoading, setStartLoading, parent = false }) {
  return startLoading ? (
    <LoadingSkeleton className={locals.skeleton} />
  ) : (
    <CallTreeHeader size="small">
      <span onClick={() => setStartLoading(true)}>
        {parent
          ? t('in-applications:traceDetail.components.callTreeHeaderParent')
          : t('in-applications:traceDetail.components.callTreeHeaderCalls')}
      </span>
    </CallTreeHeader>
  );
}
