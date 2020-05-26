import React, { useState } from 'react';

import InboundOrAllCallsChoiceHorizontal from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsChoiceHorizontal';
import InboundOrAllCallsChoiceVertical from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsChoiceVertical';
import InboundOrAllCallsOptionBox from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsOptionBox';
import { boundaryScopes } from 'in-applications/constants';

export default {
  title: 'Templates|forms/InboundOrAllCallsChoice',
  component: InboundOrAllCallsChoiceHorizontal
};

export function Default() {
  return <StatefulInboundAllCallsHorizontalStory />;
}
export function HorizontalWithExpandableCard() {
  return <StatefulInboundAllCallsHorizontalStory />;
}
export function Vertical() {
  return <StatefulInboundAllCallsVerticalStory />;
}
export function OptionBoxes() {
  return (
    <>
      {[boundaryScopes.inbound, boundaryScopes.all].map(scope =>
        [boundaryScopes.inbound, boundaryScopes.all].map(boundaryScope => (
          <InboundOrAllCallsOptionBox scope={scope} boundaryScope={boundaryScope} />
        ))
      )}
    </>
  );
}

function StatefulInboundAllCallsHorizontalStory() {
  const [value, setValue] = useState(boundaryScopes.default);
  return (
    <InboundOrAllCallsChoiceHorizontal
      boundaryScope={value}
      onBoundaryStateChange={() =>
        setValue(boundaryScopes.inbound === value ? boundaryScopes.all : boundaryScopes.inbound)
      }
      defaultBoundaryScope={boundaryScopes.inbound}
    />
  );
}

function StatefulInboundAllCallsVerticalStory() {
  const [value, setValue] = useState(boundaryScopes.default);
  return (
    <InboundOrAllCallsChoiceVertical
      boundaryScope={value}
      onBoundaryStateChange={() =>
        setValue(boundaryScopes.inbound === value ? boundaryScopes.all : boundaryScopes.inbound)
      }
    />
  );
}
