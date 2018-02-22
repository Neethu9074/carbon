import React from 'react';

import AppHeaderTimeSelection from 'in-new-components/time/AppHeaderTimeSelection/AppHeaderTimeSelection';
import ViewSwitcher from 'in-components/AppHeader/components/ViewSwitcher';
import AccountMenu from 'in-components/AppHeader/components/AccountMenu';
import { newTimePickerEnabled } from 'in-services/featureFlags';
import { homePath } from 'in-stores/navigation/paths/mainPaths';
import { getView } from 'in-stores/navigation/navigation';
import Lettering from 'in-components/Lettering';
import Link from 'in-components/Link';

import './AppHeader.less';

const block = 'in-app-header';

export default function AppHeader() {
  return (
    <div className={block}>
      <Link href$={getView(homePath)} className={`${block}__lettering`}>
        <Lettering />
      </Link>

      <ViewSwitcher />

      <div className={`${block}__right`}>
        {newTimePickerEnabled && <AppHeaderTimeSelection />}
        <AccountMenu />
      </div>
    </div>
  );
}
