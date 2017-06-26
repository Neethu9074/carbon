import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import Table from 'in-views/tableView/components/Table';

import './TableView.less';

const block = 'in-table-view';

export default function TableView() {
  const view = (
    <FullscreenOverlayView className={block}>
      <Table />
    </FullscreenOverlayView>
  );

  return (
    <div>
      {view}
      <DashboardNavigationRoute />
    </div>
  );
}
