import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import ApplicationsTable from 'in-views/applicationView/components/ApplicationsTable';

export default function Applications() {
  return (
    <MaxWidthFullscreenContainer>
      <ApplicationsTable />
    </MaxWidthFullscreenContainer>
  );
}
