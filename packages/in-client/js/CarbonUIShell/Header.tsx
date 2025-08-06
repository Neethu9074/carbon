/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

const NewPlayWithHeader = () => import(/* webpackChunkName: "trial" */ 'in-plg/Demo/NewPlayWithHeader');
const NotificationBarSticky = () =>
  // @ts-expect-error file was not migrated to typescript
  import(/* webpackChunkName: "global" */ 'in-components/Sticky/NotificationBarSticky');
const ShareAndInviteDialogBox = () =>
  import(
    /* webpackChunkName: "shareAndInvite" */ 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/ShareAndInviteDialogBox/ShareAndInviteDialogBox'
  );
const GetAnswers = () => import(/* webpackChunkName: "assistme" */ 'in-client/js/CarbonUIShell/header/GetAnswers');

import React from 'react';

import { CarbonHeaderGlobalAction as HeaderGlobalAction } from '@instana/components';
import { Stack, Button } from '@instana/carbon';
import { Tooltip } from '@instana/components';

//@ts-expect-error missing typescript migration
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { playwithEnabled, playWithReleaseEnabled } from 'in-services/featureFlags';
import { IconForButton } from 'in-plg/components/IconForButton/IconForButton';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import useAuthOverview from 'in-settings/hooks/useAuthOverview';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import AsyncComponent from 'in-components/AsyncComponent';
import UserIcon from 'in-components/UserIcon/UserIcon';
import { t } from 'in-i18n';

import local from 'in-client/js/CarbonUIShell/Header.mless';

interface HeaderContentProps {
  expanded?: boolean;
  onClickSideNavExpand?: VoidFunction;
}

export default function Header({ expanded, onClickSideNavExpand }: HeaderContentProps) {
  const [role] = useCurrentUserRole();
  const invitePermissions = role?.canConfigureUsers && !(playwithEnabled || playWithReleaseEnabled);
  const [authOverview] = useAuthOverview({ preventRequest: !invitePermissions });
  const permissionToShowInvite = invitePermissions && authOverview?.defaultLogin;
  const DeferredShareAndInviteDialogBox = createAsyncViewComponent(ShareAndInviteDialogBox);
  const DeferredGetAnswers = createAsyncViewComponent(GetAnswers);

  return (
    <Stack orientation="horizontal" gap="0.75rem">
      {playwithEnabled || playWithReleaseEnabled ? <AsyncComponent component={NewPlayWithHeader} /> : null}
      <AsyncComponent component={NotificationBarSticky} />
      {!playwithEnabled && (
        <Stack orientation="horizontal" gap="0rem">
          <Stack orientation="horizontal" gap="0.75rem" className={local.flexProperty}>
            <Tooltip align="bottomRight" content={t('in-plg:licenseBanner.shareTooltip')} themeStyle="light">
              <Button
                id="shareButton"
                kind="ghost"
                target="_blank"
                onClick={() =>
                  addActiveDialog(<DeferredShareAndInviteDialogBox permissionToShowInvite={permissionToShowInvite} />)
                }
                renderIcon={() => <IconForButton icon="lib_actions_share" iconSize="s" />}
              >
                {t('in-plg:licenseBanner.share')}
              </Button>
            </Tooltip>
            <DeferredGetAnswers />
          </Stack>
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
        </Stack>
      )}
    </Stack>
  );
}
