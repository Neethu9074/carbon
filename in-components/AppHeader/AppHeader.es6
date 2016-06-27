import React from 'react';

import NotificationCenterHeaderModule from 'in-components/notificationCenter/HeaderModule';
import ViewSwitcher from 'in-components/ViewSwitcher';
import AccountMenu from 'in-components/AccountMenu';
import SearchBar from 'in-components/SearchBar';
import Lettering from 'in-components/Lettering';
import {goHome} from 'in-stores/navigation';

import './AppHeader.less';


const block = 'in-app-header';

export default function AppHeader() {
  return (
    <div className={block}>
      <div>
        <Lettering className={block + '__lettering'}
                   onClick={goHome} />
        <SearchBar className={block + '__search'} />
      </div>

      <ViewSwitcher />

      <div className={block + '__menu'}>
        <AccountMenu />
        <NotificationCenterHeaderModule />
      </div>
    </div>
  );
}
