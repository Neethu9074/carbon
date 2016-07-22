import React from 'react';

import DashboardCloseButton from 'in-components/Dashboard/components/DashboardCloseButton';

import './DashboardHeader.less';

const block = 'in-dashboard-header';

export default function DashboardHeader() {
  return (
    <header className={block}>
      <DashboardCloseButton />

      <span className={`${block}__title`}>
        Dashboard
      </span>
    </header>
  );
}
