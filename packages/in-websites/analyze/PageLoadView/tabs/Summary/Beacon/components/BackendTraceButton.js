import { empty } from 'reactive-observables';
import React from 'react';

import getWebsiteBackendTraceId from 'in-subscription/websiteMonitoring/getWebsiteBackendTraceId';
import { navigateToBackendTraceFromPageLoad } from 'in-websites/tracker';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import Button from 'in-new-components/Button';
import TrackVisibility from 'react-on-screen';
import connect from 'in-hoc/connectTo';

import locals from './BackendTraceButton.mless';

const InternalBackendTraceButton = connect(({ beacon }) => ({
  result: beacon.backendTraceId
    ? getWebsiteBackendTraceId({
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
      href$={getLinkToTraceDetail(result.data)}
      onClick={() => navigateToBackendTraceFromPageLoad()}
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
