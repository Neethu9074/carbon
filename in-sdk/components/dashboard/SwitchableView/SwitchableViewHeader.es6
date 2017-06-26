import React from 'react';

import DashboardCloseButton from 'in-components/Dashboard/components/DashboardCloseButton';

import './SwitchableViewHeader.less';

const block = 'in-switchable-view-header';

export default function(){


  return (<header className={`${block}`}>
    <DashboardCloseButton/>
  </header>);
}
