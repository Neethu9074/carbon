import React from 'react';

import LoggingSections from 'in-applications/Dashboards/commonTabs/messages/logging/LoggingSections';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import HttpSections from 'in-applications/Dashboards/commonComponents/http/HttpSections';

export default function PerformanceTab(props) {
  return (
    <MaxWidthFullscreenContainer>
      <LoggingSections {...props} />
      <HttpSections {...props} />
    </MaxWidthFullscreenContainer>
  );
}
