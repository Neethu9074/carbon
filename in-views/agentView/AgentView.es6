import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import Table from 'in-views/agentView/components/Table';
import Title from 'in-components/Title';

import './AgentView.less';

const block = 'in-agent-view';

export default function AgentView() {
  return (
    <FullscreenOverlayView className={block}>
      <Title title="Instana Agents" />
      {DashboardNavigationRoute}
      <Table />
    </FullscreenOverlayView>
  );
}
