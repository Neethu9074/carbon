import React from 'react';

import NoPagesConfigured from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/Pages/NoPagesConfigured';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import FullscreenViewHeading from 'in-components/layout/FullscreenViewHeading';
import WebsiteTable from 'in-views/eumView/components/WebsiteTable';

export default function Pages({ snapshot }) {
  const numberOfPages = snapshot.getIn(['data', 'service_endpoints']).size;
  if (numberOfPages === 0) {
    return <NoPagesConfigured snapshot={snapshot} />;
  }
  return (
    <MaxWidthFullscreenContainer>
      <FullscreenViewHeading count={numberOfPages} iconType="globe">
        Pages
      </FullscreenViewHeading>
      <WebsiteTable snapshot={snapshot} showFilter noWebsitesMessages="No pages found for your current query." />
    </MaxWidthFullscreenContainer>
  );
}
