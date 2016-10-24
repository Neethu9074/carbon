import React from 'react';

import FullscreenOverlayView from 'in-components/FullscreenOverlayView';
import Header from 'in-views/tableView/components/Header';
import Table from 'in-views/tableView/components/Table';

import './TableView.less';

const block = 'in-table-view';

export default function TableView({children}) {
  const view = (
    <FullscreenOverlayView className={block}>
      <Header />
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
