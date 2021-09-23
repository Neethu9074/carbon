/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import ServiceEndpointList from 'in-applications/analyze/AnalyzeView2_0/components_alt/ServiceEndpointList';
import HeightRestrictedView from 'in-components/layout/HeightRestrictedView/HeightRestrictedView';
import ContentWrapper from 'in-components/LocationAwareTabView/components/ContentWrapper';
import getTraceActivityTree from 'in-applications/subscriptions/getTraceActivityTree';
import SideEffectOnPropertyChange from 'in-components/SideEffectOnPropertyChange';
import { refreshWindowSizeDependingState } from 'in-services/browser';
import { pendingResult } from 'in-services/fixedObjects';

export default function ServicesAndEndpoints({ callId, traceId }) {
  const callTreeResult = useObservable(() => getTraceActivityTree({ id: traceId }), [traceId]) ?? pendingResult;

  const effectiveCallId = callId === 'ROOT' && callTreeResult.data ? callTreeResult.data.id : callId;

  const traceDetails = (
    <ContentWrapper>
      <SideEffectOnPropertyChange callId={!effectiveCallId} sideEffect={refreshWindowSizeDependingState} />

      <ServiceEndpointList traceId={traceId} />
    </ContentWrapper>
  );

  return <HeightRestrictedView render={() => traceDetails} />;
}
