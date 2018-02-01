import React from 'react';

import TrackingScript from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/Config/TrackingScript';
import Rename from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/Config/Rename';
import Remove from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/Config/Remove';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';

export default function Config({ snapshot }) {
  return (
    <MaxWidthFullscreenContainer>
      <Rename snapshot={snapshot} />
      <TrackingScript snapshot={snapshot} />
      <Remove snapshot={snapshot} />
    </MaxWidthFullscreenContainer>
  );
}
