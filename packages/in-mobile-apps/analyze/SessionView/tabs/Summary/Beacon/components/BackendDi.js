import { combineLatest } from '@instana/observables';
import React from 'react';

import getMobileAppBackendTraces from 'in-mobile-apps/subscriptions/getMobileAppBackendTraces';
import getTraceSummary from 'in-subscription/application/getTraceSummary';
import { navigateToBackendTraceFromSession } from 'in-mobile-apps/tracker';
import { latencyFixed, number } from 'in-services/formatters/number';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import { Di } from 'in-new-components/HorizontalDescriptionList';
import Tooltip from 'in-components/Tooltip';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

export default connect(({ beacon }) => ({
  traceSummaries:
    beacon.backendTraceId &&
    getMobileAppBackendTraces({
      correlationId: beacon.backendTraceId
    })
      .filter(r => r.data != null)
      .map(r => r.data)
      .flatMap(traces =>
        combineLatest(
          traces.map(trace =>
            getTraceSummary({ id: trace.traceId })
              .filter(r => r.data != null)
              .map(r => r.data)
          )
        )
      )
}))(BackendDi);

function BackendDi({ traceSummaries }) {
  if (traceSummaries == null || traceSummaries.length === 0) {
    return null;
  }

  return (
    <Di title="Backend">
      {traceSummaries.map((summary, i) => (
        <Tooltip key={i} content="Open backend trace" align="topMiddle">
          <div>
            <Link href$={getLinkToTraceDetail(summary.id)} onClick={() => navigateToBackendTraceFromSession()}>
              {latencyFixed.compact(summary.duration)} for {number.compact(summary.callCount)} call
              {summary.callCount === 1 ? '' : 's'} with {number.compact(summary.totalErrorCount)} error
              {summary.totalErrorCount === 1 ? '' : 's'}.
            </Link>
          </div>
        </Tooltip>
      ))}
    </Di>
  );
}
