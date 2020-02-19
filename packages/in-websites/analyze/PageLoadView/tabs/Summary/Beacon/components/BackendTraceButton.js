import { empty } from 'reactive-observables';
import React from 'react';

import getWebsiteBackendTraces from 'in-websites/subscriptions/getWebsiteBackendTraces';
import { navigateToBackendTraceFromPageLoad } from 'in-websites/tracker';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import Dropdown from 'in-new-components/Dropdown';
import Button from 'in-new-components/Button';
import TrackVisibility from 'react-on-screen';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './BackendTraceButton.mless';

const InternalBackendTraceButton = connect(({ beacon }) => ({
  result: beacon.backendTraceId
    ? getWebsiteBackendTraces({
        correlationId: beacon.backendTraceId
      })
    : empty
}))(function InternalBackendTraceButton({ result }) {
  if (!result || !result.data) {
    return null;
  }

  const traces = result.data;

  if (traces.length === 0) {
    return null;
  } else if (traces.length === 1) {
    return (
      <Button
        className={locals.button}
        href$={getLinkToTraceDetail(traces[0].traceId, { callId: 'ROOT' })}
        onClick={e => {
          e.stopPropagation();
          navigateToBackendTraceFromPageLoad();
        }}
        size="compact"
      >
        View Backend Trace
      </Button>
    );
  } else {
    return (
      <Dropdown
        className={locals.dropdown}
        label="View Backend Traces"
        items={traces}
        renderItemContent={trace => (
          <Link
            href$={getLinkToTraceDetail(trace.traceId, { callId: 'ROOT' })}
            onClick={e => {
              e.stopPropagation();
              navigateToBackendTraceFromPageLoad();
            }}
          >
            id:
            {trace.traceId}
          </Link>
        )}
      />
    );
  }
});

export default function BackendTraceButton(props) {
  return (
    <TrackVisibility once offset={500} tag="span">
      {({ isVisible }) => isVisible && <InternalBackendTraceButton {...props} />}
    </TrackVisibility>
  );
}
