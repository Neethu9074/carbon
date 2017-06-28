import React from 'react';

import DashboardCloseButton from 'in-components/Dashboard/components/DashboardCloseButton';

import './SwitchableViewHeader.less';

const block = 'in-switchable-view-header';

export default function SwitchableViewHeader() {
  return (
    <header className={`${block}`}>
      <DashboardCloseButton />
    </header>
  );
}
