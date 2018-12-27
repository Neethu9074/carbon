import React from 'react';

import getWebsiteBackendTraceId from 'in-subscription/websiteMonitoring/getWebsiteBackendTraceId';
import getTraceSummary from 'in-subscription/application/getTraceSummary';
import { navigateToBackendTraceFromPageLoad } from 'in-websites/tracker';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import { Di } from 'in-new-components/HorizontalDescriptionList';
import { millis, number } from 'in-services/formatters/number';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

export default connect(({ beacon }) => ({
  result:
    beacon.backendTraceId &&
    getWebsiteBackendTraceId({
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
      <Link href$={getLinkToTraceDetail(summary.id)} onClick={() => navigateToBackendTraceFromPageLoad()}>
        {millis.fixedCompact(summary.duration)} for {number.compact(summary.callCount)} calls with{' '}
        {number.compact(summary.totalErrorCount)} errors.
      </Link>
    </Di>
  );
}
