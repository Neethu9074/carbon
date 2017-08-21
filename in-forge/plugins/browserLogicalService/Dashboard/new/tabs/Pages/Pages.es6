import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import FullscreenViewHeading from 'in-components/layout/FullscreenViewHeading';
import WebsiteTable from 'in-views/eumView/components/WebsiteTable';

export default function Pages({ snapshot }) {
  const numberOfPages = snapshot.getIn(['data', 'service_endpoints']).size;
  if (numberOfPages === 0) {
    // TODO MAKE THIS LOOK NICE
    return (
      <MaxWidthFullscreenContainer>
        NO PAGES FOUND, THIS IS HOW YOU CONFIGURE PAGES! TODO MAKE IT LOOK NICE
      </MaxWidthFullscreenContainer>
    );
  }
  return (
    <MaxWidthFullscreenContainer>
      <FullscreenViewHeading count={numberOfPages} iconType="globe">Pages</FullscreenViewHeading>
      <WebsiteTable snapshot={snapshot} />
    </MaxWidthFullscreenContainer>
  );
}
