import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import NoXMessage from 'in-sdk/components/dashboard/NoXMessage';
import Title from 'in-components/Title';
import SpaTable from './SpaTable';

export default function Transitions({ snapshot }) {
  const numberOfTransitions = snapshot.getIn(['data', 'service_endpoints']).size;
  if (numberOfTransitions === 0) {
    return (
      <NoXMessage centered>
        <Title title="SPA Transitions" />
        No transitions found for your current query.
      </NoXMessage>
    );
  }
  return (
    <MaxWidthFullscreenContainer>
      <SpaTable snapshot={snapshot} />
    </MaxWidthFullscreenContainer>
  );
}
