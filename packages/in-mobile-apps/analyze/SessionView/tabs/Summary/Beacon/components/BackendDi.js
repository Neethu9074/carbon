import React from 'react';

import getMobileAppBackendTraceId from 'in-mobile-apps/subscriptions/getMobileAppBackendTraceId';
import getTraceSummary from 'in-subscription/application/getTraceSummary';
import { navigateToBackendTraceFromSession } from 'in-mobile-apps/tracker';
import { latencyFixed, number } from 'in-services/formatters/number';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import { Di } from 'in-new-components/HorizontalDescriptionList';
import Tooltip from 'in-components/Tooltip';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

export default connect(({ beacon }) => ({
  result:
    beacon.backendTraceId &&
    getMobileAppBackendTraceId({
      traceId: beacon.backendTraceId,
      beaconTimestamp: beacon.timestamp
    })
      .filter(r => r.data != null)
      .flatMap(r => getTraceSummary({ id: r.data }))
}))(BackendDi);

function BackendDi({ result }) {
  if (!result || !result.data) {
    return null;
  }

  const summary = result.data;

  return (
    <Di title="Backend">
      <Tooltip content="Open backend trace" align="topMiddle">
        <Link href$={getLinkToTraceDetail(summary.id)} onClick={() => navigateToBackendTraceFromSession()}>
          {latencyFixed.compact(summary.duration)} for {number.compact(summary.callCount)} call
          {summary.callCount === 1 ? '' : 's'} with {number.compact(summary.totalErrorCount)} error
          {summary.totalErrorCount === 1 ? '' : 's'}.
        </Link>
      </Tooltip>
    </Di>
  );
}
