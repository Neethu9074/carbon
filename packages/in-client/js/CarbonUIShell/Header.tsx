/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error promise loader
import NotificationBarSticky from 'promise-loader?global!in-components/Sticky/NotificationBarSticky';
// @ts-expect-error promise loader
import NewPlayWithHeader from 'promise-loader?global!in-plg/Demo/NewPlayWithHeader';
import React from 'react';

import { CarbonStack, CarbonHeaderGlobalAction as HeaderGlobalAction } from '@instana/components';

import { ShowPrivacyNotification } from 'in-plg/components/ShowPrivacyNotification/ShowPrivacyNotification';
import { playwithEnabled, playWithReleaseEnabled, tealiumPrivacyEnabled } from 'in-services/featureFlags';
import AsyncComponent from 'in-components/AsyncComponent';
import UserIcon from 'in-components/UserIcon/UserIcon';
import { t } from 'in-i18n';

import local from 'in-client/js/CarbonUIShell/Header.mless';

interface HeaderContentProps {
  expanded?: boolean;
  onClickSideNavExpand?: VoidFunction;
}

export default function Header({ expanded, onClickSideNavExpand }: HeaderContentProps) {
  return (
    <>
      {playwithEnabled || playWithReleaseEnabled ? <AsyncComponent component={NewPlayWithHeader} /> : null}
      <AsyncComponent component={NotificationBarSticky} />
      {!playwithEnabled && (
        <CarbonStack>
          <div id="profileMenu-switcher">
            <HeaderGlobalAction
              onClick={onClickSideNavExpand}
              aria-label={t('in-components:mainNavigation.profileMenu_tooltip')}
              aria-expanded={expanded}
              isActive={expanded}
              aria-haspopup="true"
              tooltipAlignment="end"
            >
              <UserIcon size="s" color="var(--cds-icon-secondary)" className={local.userIcon} />
            </HeaderGlobalAction>
          </div>
          {tealiumPrivacyEnabled && ShowPrivacyNotification()}
        </CarbonStack>
      )}
    </>
  );
}
