import { empty } from 'reactive-observables';
import React from 'react';

import getWebsiteBackendTraceId from 'in-subscription/websiteMonitoring/getWebsiteBackendTraceId';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import TrackVisibility from 'react-on-screen';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

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
    <Tooltip content="Open backend trace" align="leftMiddle">
      <Link className={locals.link} href$={getLinkToTraceDetail(result.data)}>
        <SvgIcon type="lib_application_trace_invert" className={locals.icon} width={20} />
      </Link>
    </Tooltip>
  );
});

export default function BackendTraceButton(props) {
  return (
    <TrackVisibility once offset={500} tag="span">
      {({ isVisible }) => isVisible && <InternalBackendTraceButton {...props} />}
    </TrackVisibility>
  );
}
