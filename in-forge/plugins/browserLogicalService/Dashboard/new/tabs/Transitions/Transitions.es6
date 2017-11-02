import React from 'react';

import NoTransitionsConfigured from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/Transitions/NoTransitionsConfigured';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import SpaTable from 'in-views/eumView/components/SpaTable';

export default function Transitions({ snapshot }) {
  const numberOfTransitions = snapshot.getIn(['data', 'service_endpoints']).size;
  if (numberOfTransitions === 0) {
    return <NoTransitionsConfigured snapshot={snapshot} />;
  }
  return (
    <MaxWidthFullscreenContainer>
      <SpaTable snapshot={snapshot} showFilter noWebsitesMessages="No transitions found for your current query." />
    </MaxWidthFullscreenContainer>
  );
}
