import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import WebsiteTable from 'in-views/eumView/components/WebsiteTable';

import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import './EumView.less';

const block = 'in-eum';

export default function EumView() {
  return (
    <FullscreenOverlayView>
      <div className={block}>
        <h4>End User Monitoring</h4>
        <WebsiteTable />
        <DashboardNavigationRoute />
      </div>
    </FullscreenOverlayView>
  );
}
