import { empty } from 'reactive-observables';
import React from 'react';

import getMobileAppBackendTraceId from 'in-mobile-apps/subscriptions/getMobileAppBackendTraceId';
import { navigateToBackendTraceFromSession } from 'in-mobile-apps/tracker';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import Button from 'in-new-components/Button';
import TrackVisibility from 'react-on-screen';
import connect from 'in-hoc/connectTo';

import locals from './BackendTraceButton.mless';

const InternalBackendTraceButton = connect(({ beacon }) => ({
  result: beacon.backendTraceId
    ? getMobileAppBackendTraceId({
        traceId: beacon.backendTraceId,
        beaconTimestamp: beacon.timestamp
      })
    : empty
}))(function InternalBackendTraceButton({ result }) {
  if (!result || !result.data) {
    return null;
  }

  return (
    <Button
      className={locals.button}
      href$={getLinkToTraceDetail(result.data, { callId: 'ROOT' })}
      onClick={e => {
        e.stopPropagation();
        navigateToBackendTraceFromSession();
      }}
      size="compact"
    >
      View Backend Trace
    </Button>
  );
});

export default function BackendTraceButton(props) {
  return (
    <TrackVisibility once offset={500} tag="span">
      {({ isVisible }) => isVisible && <InternalBackendTraceButton {...props} />}
    </TrackVisibility>
  );
}
