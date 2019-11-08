import { storiesOf } from '@storybook/react';
import React, { useState } from 'react';

import InboundOrAllCallsChoice from 'in-applications/Dashboards/commonComponents/InboundOrAllCallsChoice';
import { boundaryScopes } from 'in-applications/constants';

storiesOf('Components/InboundOrAllCalls', module)
  .addParameters({ component: InboundOrAllCallsChoice })
  .add('styled', () => <InboundOrAllCallsStory />);

function InboundOrAllCallsStory() {
  return <StatefulInboundAllCallsStory />;
}

function StatefulInboundAllCallsStory() {
  const [value, setValue] = useState(boundaryScopes.default);
  return (
    <InboundOrAllCallsChoice
      boundaryScope={value}
      onBoundaryStateChange={() =>
        setValue(boundaryScopes.inbound === value ? boundaryScopes.all : boundaryScopes.inbound)
      }
    />
  );
}
