import React from 'react';

import AppHeaderTimeSelection from 'in-new-components/time/AppHeaderTimeSelection/AppHeaderTimeSelection';
import VersionSwitcher from 'in-components/AppHeader/components/VersionSwitcher';
import ViewSwitcher from 'in-components/AppHeader/components/ViewSwitcher';
import AccountMenu from 'in-components/AppHeader/components/AccountMenu';
import { homePath } from 'in-stores/navigation/paths/mainPaths';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import { getView } from 'in-stores/navigation/navigation';
import Lettering from 'in-components/Lettering';
import Link from 'in-components/Link';

import locals from './AppHeader.mless';

export default function AppHeader() {
  return (
    <div className={locals.header}>
      <Link href$={getView(homePath)} className={locals.lettering}>
        <Lettering />
      </Link>

      <VersionSwitcher />

      <ViewSwitcher />

      <div className={locals.right}>
        {twoZeroModeEnabled && <AppHeaderTimeSelection />}
        <AccountMenu />
      </div>
    </div>
  );
}
