import React from 'react';

import AppHeaderTimeSelection from 'in-new-components/time/AppHeaderTimeSelection/AppHeaderTimeSelection';
import ViewSwitcher from 'in-components/AppHeader/components/ViewSwitcher';
import AccountMenu from 'in-components/AppHeader/components/AccountMenu';
import { homePath } from 'in-stores/navigation/paths/mainPaths';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import { getView } from 'in-stores/navigation/navigation';
import Lettering from 'in-components/Lettering';
import Badge from 'in-new-components/Badge';
import Link from 'in-components/Link';

import './AppHeader.less';

const block = 'in-app-header';

export default function AppHeader() {
  return (
    <div className={block}>
      <Link href$={getView(homePath)} className={`${block}__lettering`}>
        <Lettering />
      </Link>

      {twoZeroModeEnabled && (
        <Badge size="mid" color="#06b7ba" className={`${block}__early`}>
          Early access
        </Badge>
      )}

      {!twoZeroModeEnabled && <ViewSwitcher />}

      <div className={`${block}__right`}>
        {twoZeroModeEnabled && <AppHeaderTimeSelection />}
        <AccountMenu />
      </div>
    </div>
  );
}
