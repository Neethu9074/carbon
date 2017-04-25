import React from 'react';

import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import Table from 'in-views/tableView/components/Table';

import './TableView.less';

const block = 'in-table-view';

export default function TableView({ children }) {
  const view = (
    <FullscreenOverlayView className={block}>
      <Table />
    </FullscreenOverlayView>
  );

  if (!children) {
    return view;
  }

  return (
    <div>
      {view}
      {children}
    </div>
  );
}
