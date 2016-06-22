import React from 'react';

import NotificationCenterHeaderModule from 'in-components/notificationCenter/HeaderModule';
import ViewSwitcher from 'in-components/ViewSwitcher';
import AccountMenu from 'in-components/AccountMenu';
import Lettering from 'in-components/Lettering';

import './AppHeader.less';

const block = 'in-app-header';

export default function AppHeader() {
  return (
    <div className={block}>
      <Lettering className={block + '__lettering'}/>

      Search...

      <ViewSwitcher />

      <div className={block + '__menu'}>
        <AccountMenu />
        <NotificationCenterHeaderModule />
      </div>
    </div>
  );
}
