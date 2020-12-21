import TrackVisibility from 'react-on-screen';
import { empty } from '@instana/observables';
import React from 'react';

import getMobileAppBackendTraces from 'in-mobile-apps/subscriptions/getMobileAppBackendTraces';
import { navigateToBackendTraceFromSession } from 'in-mobile-apps/tracker';
import { MoreMenu, MoreMenuButton } from 'in-new-components/MoreMenu';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import Button from 'in-new-components/Button';
import connect from 'in-hoc/connectTo';

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
        kind="primaryv2"
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
      <MoreMenu kind="primaryv2" size="compact" className={locals.button}>
        {traces.map(({ traceId }) => (
          <MoreMenuButton
            key={traceId}
            href$={getLinkToTraceDetail(traceId, { callId: 'ROOT' })}
            onClick={() => navigateToBackendTraceFromSession()}
          >
            ID: {traceId}
          </MoreMenuButton>
        ))}
      </MoreMenu>
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
