/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useEffect } from 'react';
import React from 'react';

//@ts-expect-error missing typescript migration
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { PROFILE_MENU_SWITCH_TENANT_OR_UNIT_CLICK } from 'in-services/tracking/eventNames';
import { playwithEnabled, playWithReleaseEnabled } from 'in-services/featureFlags';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { customTopNavItemClicked$ } from 'in-services/integrations/solis';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import useAuthOverview from 'in-settings/hooks/useAuthOverview';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import config from 'in-services/config';

const ShareAndInviteDialogBox = () =>
  import(
    /* webpackChunkName: "shareAndInvite" */ 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Invites/ShareAndInviteDialogBox/ShareAndInviteDialogBox'
  );

export const CustomTopNavItemListener = () => {
  const [role] = useCurrentUserRole();
  const { trackCta } = useSegmentTracking();

  const invitePermissions = role?.canConfigureUsers && !(playwithEnabled || playWithReleaseEnabled);
  const [authOverview] = useAuthOverview({ preventRequest: !invitePermissions });
  const permissionToShowInvite = invitePermissions && authOverview?.defaultLogin;
  const DeferredShareAndInviteDialogBox = createAsyncViewComponent(ShareAndInviteDialogBox);
  useEffect(() => {
    const subscription = customTopNavItemClicked$.subscribe(event => {
      const clickedItemId = event.detail.id;
      if (clickedItemId === 'share') {
        addActiveDialog(<DeferredShareAndInviteDialogBox permissionToShowInvite={permissionToShowInvite} />);
      } else if (clickedItemId === 'switch_tenant') {
        const tenantSwitcherLink = `https://${config.tenantUnitDomainSuffix}/tenantSwitcher`;
        trackCta(PROFILE_MENU_SWITCH_TENANT_OR_UNIT_CLICK);
        window.open(tenantSwitcherLink, '_blank');
      }
    });

    return () => {
      subscription.dispose?.();
    };
  });

  return null;
};
