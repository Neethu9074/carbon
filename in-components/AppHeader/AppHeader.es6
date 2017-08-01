import React from 'react';

import ViewSwitcher from 'in-components/AppHeader/components/ViewSwitcher';
import AccountMenu from 'in-components/AppHeader/components/AccountMenu';
import { homeLink$ } from 'in-stores/navigation';
import Lettering from 'in-components/Lettering';
import Link from 'in-components/Link';

import './AppHeader.less';

const block = 'in-app-header';

export default function AppHeader() {
  return (
    <div className={block}>
      <Link href$={homeLink$} className={`${block}__lettering`}>
        <Lettering />
      </Link>

      <ViewSwitcher />

      <div className={`${block}__right`}>
        <AccountMenu />
      </div>
    </div>
  );
}
