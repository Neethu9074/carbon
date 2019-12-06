import React, { useState } from 'react';

import InboundOrAllCallsChoiceHorizontal from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsChoiceHorizontal';
import InboundOrAllCallsChoiceVertical from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsChoiceVertical';
import InboundOrAllCallsOptionBox from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsOptionBox';
import { boundaryScopes } from 'in-applications/constants';
import { storiesOf } from '@storybook/react';
import Section from '../_helpers/Section';
import Root from '../_helpers/Root';

storiesOf('Components/InboundOrAllCalls', module)
  .addParameters({ component: InboundOrAllCallsChoiceHorizontal })
  .add('default', () => <StatefulInboundAllCallsHorizontalStory />)
  .add('horizontal with expandable card', () => <StatefulInboundAllCallsHorizontalStory />)
  .add('vertical', () => <StatefulInboundAllCallsVerticalStory />)
  .add('option boxes', () => <OptionBoxes />);

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

function OptionBoxes() {
  return (
    <Root>
      {[boundaryScopes.inbound, boundaryScopes.all].map(scope =>
        [boundaryScopes.inbound, boundaryScopes.all].map(boundaryScope => (
          <Section title={scope + ' box when boundary scope is ' + boundaryScope}>
            <InboundOrAllCallsOptionBox scope={scope} boundaryScope={boundaryScope} />
          </Section>
        ))
      )}
    </Root>
  );
}
