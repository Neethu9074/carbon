import React from 'react';

import PageLoadAndBackendTraceButtons from 'in-components/PageLoadAndBackendTraceButtons';
import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { getTraceViewLinkShowingTrace } from 'in-stores/navigation/paths/tracePaths';
import { getCommonDescriptionItems } from 'in-forge/tracing/page/commonEumSpanItems';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import getTraceDetails20TraceId from 'in-subscription/getTraceDetails20TraceId';
import DashboardNotification from 'in-components/DashboardNotification';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import convertHexToLong from 'in-subscription/hexToLong';
import { pendingResult } from 'in-services/fixedObjects';
import { selectedTraceId$ } from 'in-stores/traces';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    const possibeBackendTraceId = props.span.get('traceId') || props.trace.get('traceId');

    // check if a 2.0 backend trace detail view is available
    const observables = twoZeroModeEnabled
      ? {
          backendTraceIdResult: getTraceDetails20TraceId(possibeBackendTraceId).startWith(pendingResult)
        }
      : {};

    const pageLoadTraceId = props.span.getIn(['data', 'page_xhr', 'plt']);
    if (pageLoadTraceId) {
      const pageLoadTraceId$ = convertHexToLong(pageLoadTraceId);
      observables.pageLoadTraceId = pageLoadTraceId$;
      observables.selectedTraceId = selectedTraceId$;
      observables.pageLoadTraceLink = pageLoadTraceId$.flatMap(traceId => getTraceViewLinkShowingTrace(traceId));
    }

    return observables;
  },
  function XhrSpanDetailView({ span, pageLoadTraceLink, pageLoadTraceId, selectedTraceId, backendTraceIdResult }) {
    const hidden = span.getIn(['data', 'page_xhr', 'h'], false);

    return (
      <div>
        <PageLoadAndBackendTraceButtons
          pageLoadTraceLink={pageLoadTraceLink}
          pageLoadTraceId={pageLoadTraceId}
          selectedTraceId={selectedTraceId}
          backendTraceIdResult={backendTraceIdResult}
        />

        <DescriptionList>
          <DescriptionItem title="Host">{span.getIn(['data', 'http', 'host'])}</DescriptionItem>
          <DescriptionItem title="URL">{span.getIn(['data', 'http', 'url'])}</DescriptionItem>
          <DescriptionItem title="Method">{span.getIn(['data', 'http', 'method'])}</DescriptionItem>
          <DescriptionItem title="Status Code">{span.getIn(['data', 'http', 'status'])}</DescriptionItem>
          <ErrorDescriptionItem error={span.getIn(['data', 'http', 'error'])} />

          {getCommonDescriptionItems(span)}
        </DescriptionList>

        {hidden && (
          <DashboardNotification type="info">
            This HTTP call was made while the browser window was hidden, i.e.{' '}
            <code>document.visibilityState === &#39;hidden&#39;</code>. As a result, browsers may throttle down code
            execution. This can negatively impact measured request durations. More information can be found in our{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.instana.io/products/website_monitoring/faq/#why-are-the-recorded-timings-for-my-http-calls-so-unusually-huge"
            >
              website monitoring FAQ
            </a>.
          </DashboardNotification>
        )}
      </div>
    );
  }
);
