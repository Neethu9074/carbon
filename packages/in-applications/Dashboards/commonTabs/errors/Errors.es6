import React from 'react';

import LoggingSections from 'in-applications/Dashboards/commonTabs/errors/logging/LoggingSections';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';

export default function PerformanceTab(props) {
  return (
    <MaxWidthFullscreenContainer>
      <LoggingSections {...props} />
    </MaxWidthFullscreenContainer>
  );
}
