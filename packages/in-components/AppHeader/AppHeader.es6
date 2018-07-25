import React from 'react';

import AppHeaderTimeSelection from 'in-new-components/time/AppHeaderTimeSelection/AppHeaderTimeSelection';
import VersionSwitcher from 'in-components/AppHeader/components/VersionSwitcher';
import ViewSwitcher from 'in-components/AppHeader/components/ViewSwitcher';
import AccountMenu from 'in-components/AppHeader/components/AccountMenu';
import { twoZeroModeEnabled } from 'in-services/featureFlags';

import locals from './AppHeader.mless';

export default function AppHeader() {
  return (
    <div className={locals.header}>
      <VersionSwitcher />

      <ViewSwitcher />

      <div className={locals.right}>
        {twoZeroModeEnabled && <AppHeaderTimeSelection />}
        <AccountMenu />
      </div>
    </div>
  );
}
