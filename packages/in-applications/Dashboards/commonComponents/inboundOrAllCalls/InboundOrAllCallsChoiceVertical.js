import React from 'react';

import InboundOrAllCallsOptionBox from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsOptionBox';
import { boundaryScopes } from 'in-applications/constants';

export default function InboundOrAllCallsChoiceVertical({ boundaryScope, onBoundaryStateChange, apCreation }) {
  return (
    <>
      <InboundOrAllCallsOptionBox
        boundaryScope={boundaryScope}
        onBoundaryStateChange={onBoundaryStateChange}
        scope={boundaryScopes.inbound}
        apCreation={apCreation}
        noPaddingBottom
      />
      <InboundOrAllCallsOptionBox
        boundaryScope={boundaryScope}
        onBoundaryStateChange={onBoundaryStateChange}
        scope={boundaryScopes.all}
        apCreation={apCreation}
        noPaddingBottom
      />
    </>
  );
}
