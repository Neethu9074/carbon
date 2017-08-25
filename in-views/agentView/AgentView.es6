import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import Table from 'in-views/agentView/components/Table';

import './AgentView.less';

const block = 'in-agent-view';

export default function AgentView() {
  return (
    <FullscreenOverlayView className={block}>
      <DashboardNavigationRoute />
      <Table />
    </FullscreenOverlayView>
  );
}
