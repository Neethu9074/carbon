/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useCallback, useState } from 'react';

import { create } from '@instana/observables';

import TraceExamples from 'in-applications/analyze/components/TraceDetails/components/CallTree/stories/TraceExamplesComponent';
import CallTree from 'in-applications/analyze/components/TraceDetails/components/CallTree';
import { getColorPool } from 'in-services/util/ColorGenerator';

const byServiceEndpointCombinationColorPool = getColorPool('serviceAndEndpointCombination');
const getColorByServiceAndEndpoint = ({ service, endpoint }) =>
  byServiceEndpointCombinationColorPool.getColorHex(`${service.id}__${endpoint.id}`);

export default {
  component: CallTree
};

export function CallTreeStory() {
  const [expandedCalls, setExpandedCalls] = useState(new Set());
  const onCallExpanded = useCallback(
    callId => setExpandedCalls(old => new Set(Array.from(old.keys())).add(callId)),
    []
  );
  const onCallCollapsed = useCallback(
    callId =>
      setExpandedCalls(old => {
        var newValue = new Set(Array.from(old.keys()));
        newValue.delete(callId);
        return newValue;
      }),
    []
  );
  return (
    <TraceExamples
      render={rootCall => (
        <CallTree
          selectedCall$={create()}
          openedCall$={create()}
          callTreeResult={{ data: rootCall, errors: [], progress: {} }}
          getColor={getColorByServiceAndEndpoint}
          expandedCalls={expandedCalls}
          onCallExpanded={onCallExpanded}
          onCallCollapsed={onCallCollapsed}
        />
      )}
    />
  );
}

export function LoadingStory() {
  return <CallTree selectedCall$={create()} callTreeResult={{ progress: { loading: true } }} />;
}

export function ErrorStory() {
  return (
    <CallTree
      selectedCall$={create()}
      callTreeResult={{ errors: [{ message: 'something went wrong' }, { message: 'also this should not happen' }] }}
    />
  );
}
