import React from 'react';

import Rename from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/Config/Rename';
import Remove from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/Config/Remove';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { getEumSnippet } from 'in-services/eum';
import Code from 'in-components/Code';

export default function Config({ snapshot }) {
  return (
    <MaxWidthFullscreenContainer>
      <Rename snapshot={snapshot} />

      <DashboardTile title="Tracking Script">
        <Code code={getEumSnippet({ key: snapshot.getIn(['data', 'eumKey']) })} lang="html" showLineNumbers={false} />
      </DashboardTile>

      <Remove snapshot={snapshot} />
    </MaxWidthFullscreenContainer>
  );
}
