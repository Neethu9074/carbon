import React from 'react';

import AppHeaderTimeSelection from 'in-new-components/time/AppHeaderTimeSelection/AppHeaderTimeSelection';
import { isTwoZeroBetaPhase, twoZeroAppDataEnabled, twoZeroModeEnabled } from 'in-services/featureFlags';
import VersionSwitcher from 'in-components/AppHeader/components/VersionSwitcher';
import ViewSwitcher from 'in-components/AppHeader/components/ViewSwitcher';
import AccountMenu from 'in-components/AppHeader/components/AccountMenu';
import { homePath } from 'in-stores/navigation/paths/mainPaths';
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

      {/*
      2.0-preview. The early access badge will be removed once we start replacing the preview deployments with hybrid
      mode deployments.
      */}
      {twoZeroAppDataEnabled &&
        !isTwoZeroBetaPhase && (
          <Badge size="mid" color="#06b7ba" className={`${block}__early`}>
            Early access
          </Badge>
        )}

      {/* Beta phase/hybrid mode: Let users switch between 1.0 and 2.0 */}
      {isTwoZeroBetaPhase && <VersionSwitcher />}

      {<ViewSwitcher />}

      <div className={`${block}__right`}>
        {twoZeroModeEnabled && <AppHeaderTimeSelection />}
        <AccountMenu />
      </div>
    </div>
  );
}
