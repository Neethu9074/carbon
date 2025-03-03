/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { LoadingSkeleton } from '@instana/components';

import {
  OnParentAndSiblingCallsLoadedProps,
  OnRelatedCallsLoadedProps
} from 'in-applications/analyze/components/TraceDetails/components/CallTree/hooks/useLoadCallTree';
import {
  isLazyParentNode,
  LazyChildNode,
  LazyParentNode,
  LazySiblingNode
} from 'in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree';
import { useLoadLazyRelatedCalls } from 'in-applications/analyze/components/TraceDetails/components/CallTree/hooks/useLoadLazyRelatedCalls';
import { useLoadLazyParentNode } from 'in-applications/analyze/components/TraceDetails/components/CallTree/hooks/useLoadLazyParentNode';
import CallTreeHeader from 'in-applications/analyze/AnalyzeView2_0/components/CallTreeHeader';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import { Error } from 'in-types';
import { t } from 'in-i18n';

import locals from './LazyLoadingCalls.mless';

interface LazyLoadingCallsProps {
  lazyNode: LazyParentNode | LazyChildNode | LazySiblingNode;
  onParentAndSiblingCallsLoaded: OnParentAndSiblingCallsLoadedProps;
  onRelatedCallsLoaded: OnRelatedCallsLoadedProps;
}

export function LazyLoadingCalls({
  lazyNode,
  onParentAndSiblingCallsLoaded,
  onRelatedCallsLoaded
}: LazyLoadingCallsProps) {
  return isLazyParentNode(lazyNode) ? (
    <LazyParentAndSiblingCalls
      lazyParentNode={lazyNode}
      onParentAndSiblingCallsLoaded={onParentAndSiblingCallsLoaded}
    />
  ) : (
    <LazyRelatedCalls lazyNode={lazyNode} onRelatedCallsLoaded={onRelatedCallsLoaded} />
  );
}

interface LazyParentAndSiblingCallsProps {
  lazyParentNode: LazyParentNode;
  onParentAndSiblingCallsLoaded: OnParentAndSiblingCallsLoadedProps;
}

function LazyParentAndSiblingCalls({ lazyParentNode, onParentAndSiblingCallsLoaded }: LazyParentAndSiblingCallsProps) {
  const [startLoading, setStartLoading] = useState(false);
  useLoadLazyParentNode({ lazyParentNode, onParentAndSiblingCallsLoaded, startLoading, setStartLoading });
  return (
    <LoadButtonOrSkeleton
      startLoading={startLoading}
      setStartLoading={setStartLoading}
      errors={lazyParentNode.errors}
      parent
    />
  );
}

interface LazyRelatedCallsProps {
  lazyNode: LazyChildNode | LazySiblingNode;
  onRelatedCallsLoaded: OnRelatedCallsLoadedProps;
}

function LazyRelatedCalls({ lazyNode, onRelatedCallsLoaded }: LazyRelatedCallsProps) {
  const { cursor, errors } = lazyNode;
  const autoLoadInitialChildBatch = !cursor || cursor.offset === 0;
  const [startLoading, setStartLoading] = useState(autoLoadInitialChildBatch);

  useLoadLazyRelatedCalls({ lazyNode, onRelatedCallsLoaded, startLoading, setStartLoading });
  return <LoadButtonOrSkeleton startLoading={startLoading} setStartLoading={setStartLoading} errors={errors} />;
}

interface LoadButtonOrSkeletonProps {
  startLoading: boolean;
  setStartLoading: (startLoading: boolean) => void;
  parent?: boolean;
  errors?: Error[];
}

function LoadButtonOrSkeleton({ startLoading, setStartLoading, parent = false, errors }: LoadButtonOrSkeletonProps) {
  const { trackRetryCallClicked, trackLoadRootCallClicked, trackLoadChildCallClicked } = useApplicationTracker();
  if (startLoading) {
    return <LoadingSkeleton className={locals.skeleton} />;
  }

  function handleOnClick(retry?: boolean) {
    if (retry) {
      trackRetryCallClicked();
    } else if (parent) {
      trackLoadRootCallClicked();
    } else {
      trackLoadChildCallClicked();
    }
    setStartLoading(true);
  }

  if (errors && errors.length > 0) {
    return (
      <CallTreeHeader size="small" errorState>
        {parent
          ? t('in-applications:traceDetail.components.callTreeLoadingOfParentFailed')
          : t('in-applications:traceDetail.components.callTreeLoadingOfCallsFailed')}
        <span className={locals.tryAgainButton} onClick={() => handleOnClick(true)}>
          {t('in-applications:traceDetail.components.retry')}
        </span>
      </CallTreeHeader>
    );
  }

  return (
    <CallTreeHeader size="small" onClick={() => handleOnClick()}>
      {parent
        ? t('in-applications:traceDetail.components.callTreeHeaderParent')
        : t('in-applications:traceDetail.components.callTreeHeaderCalls')}
    </CallTreeHeader>
  );
}
