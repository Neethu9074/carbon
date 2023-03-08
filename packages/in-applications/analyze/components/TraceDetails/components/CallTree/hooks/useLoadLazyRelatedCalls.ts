/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useEffect } from 'react';

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import {
  LazyChildNode,
  LazySiblingNode
} from 'in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree';
import getRelatedCallsDetailsWithCursor from 'in-applications/subscriptions/getRelatedCallsDetailsWithCursor';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';

/**
 * Lazy sibling or child nodes should use this hook to load the next batch of theirs siblings.
 */
export function useLoadLazyRelatedCalls({
  lazyNode,
  onRelatedCallsLoaded,
  startLoading,
  setStartLoading
}: {
  lazyNode: LazySiblingNode | LazyChildNode;
  onRelatedCallsLoaded: any;
  startLoading: boolean;
  setStartLoading: (startLoading: boolean) => void;
}) {
  const { traceId, callId, relation, cursor } = lazyNode;

  const getRelatedCallsDetailsResult =
    useObservable(
      () => (startLoading ? getRelatedCallsDetailsWithCursor({ traceId, callId, relation, cursor }) : just(null)),
      [traceId, callId, relation, cursor, startLoading]
    ) ?? pendingResult;

  useEffect(() => {
    if (isLoading(getRelatedCallsDetailsResult)) {
      return;
    }

    setStartLoading(false);
    onRelatedCallsLoaded({ callId, relation, getRelatedCallsDetailsResult });
  }, [getRelatedCallsDetailsResult, onRelatedCallsLoaded, callId, relation, setStartLoading]);
}
