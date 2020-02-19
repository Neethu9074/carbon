import { empty } from 'reactive-observables';
import React from 'react';

import getMobileAppBackendTraces from 'in-mobile-apps/subscriptions/getMobileAppBackendTraces';
import { navigateToBackendTraceFromSession } from 'in-mobile-apps/tracker';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import Dropdown from 'in-new-components/Dropdown';
import Button from 'in-new-components/Button';
import TrackVisibility from 'react-on-screen';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './BackendTraceButton.mless';

const InternalBackendTraceButton = connect(({ beacon }) => ({
  result: beacon.backendTraceId
    ? getMobileAppBackendTraces({
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
          navigateToBackendTraceFromSession();
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
              navigateToBackendTraceFromSession();
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
