import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import Table from 'in-views/tableView/components/Table';
import Title from 'in-components/Title';

export default function TableView() {
  return (
    <div>
      <Title title="Comparison Table" />

      <FullscreenOverlayView>
        <Table />
      </FullscreenOverlayView>

      {DashboardNavigationRoute}
    </div>
  );
}
