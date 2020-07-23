import React from 'react';

import InboundOrAllCallsOptionBox from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsOptionBox';
import { boundaryScopes } from 'in-applications/constants';

export default function InboundOrAllCallsChoiceVertical({ boundaryScope, onBoundaryStateChange }) {
  return (
    <>
      <InboundOrAllCallsOptionBox
        boundaryScope={boundaryScope}
        onBoundaryStateChange={onBoundaryStateChange}
        scope={boundaryScopes.inbound}
      />
      <InboundOrAllCallsOptionBox
        boundaryScope={boundaryScope}
        onBoundaryStateChange={onBoundaryStateChange}
        scope={boundaryScopes.all}
        noPaddingBottom
      />
    </>
  );
}
