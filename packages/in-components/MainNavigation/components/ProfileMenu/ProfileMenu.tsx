/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import {
  CarbonSwitcher as Switcher,
  CarbonSwitcherItem as SwitcherItem,
  CarbonSwitcherDivider as SwitcherDivider,
  Typography,
  SvgIcon,
  Link,
  Stack,
  Spacer
} from '@instana/components';
import { t } from '@instana/i18n-react';

import {
  PROFILE_MENU_LOGOUT_CLICK,
  PROFILE_MENU_SWITCH_TENANT_OR_UNIT_CLICK,
  PROFILE_MENU_USER_PROFILE_CLICK
} from 'in-services/tracking/tracking';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { userSettingsProfile } from 'in-settings/navigation/paths';
import { tenantSwitcherEnabled } from 'in-services/featureFlags';
import config from 'in-services/config';
import { user } from 'in-stores/user';

import local from 'in-components/MainNavigation/components/ProfileMenu/ProfileMenu.mless';

interface ProfileMenuProps {
  onClickSideNavExpand: VoidFunction;
  isSideNavExpanded: boolean;
}

export default function ProfileMenu({ onClickSideNavExpand, isSideNavExpanded }: ProfileMenuProps): JSX.Element {
  const tenantSwitcherLink = `https://${config.tenantUnitDomainSuffix}/tenantSwitcher`;
  const { trackCta } = useSegmentTracking();

  const signOut = (event: MouseEvent) => {
    event.preventDefault();
    trackCta(PROFILE_MENU_LOGOUT_CLICK);

    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/auth/signOut';
    document.body.appendChild(form);
    form.submit();
  };
  return (
    <div className={local.profileMenu}>
      <Stack direction="vertical" gap="xsmall">
        <div className={local.profileMenu_header}>
          <Spacer vertical="xsmall" />
          <Typography variant="heading-03" onDark noMargin>
            {user?.fullName}
          </Typography>
          <Spacer vertical="xsmall" />
          <Typography variant="label-01" onDark component="p" noMargin noWrap>
            <span className={local.profileMenu_label}>{user?.email}</span>
          </Typography>
          <Spacer vertical="small" />
          <Typography variant="label-01" onDark>
            <Link
              href={`#${userSettingsProfile}`}
              onClick={() => {
                trackCta(PROFILE_MENU_USER_PROFILE_CLICK);
                onClickSideNavExpand();
              }}
              size="sm"
            >
              {t('in-components:mainNavigation.profileMenu_profileLink')}
            </Link>
          </Typography>
        </div>
        <SwitcherDivider />
        <div className={local.profileMenu_unitTenantSection}>
          <Typography variant="label-01" onDark>
            <label className={local.profileMenu_label}>
              {t('in-components:mainNavigation.profileMenu_unitName_tenantName')}
            </label>
          </Typography>
          <Spacer vertical="small" />
          <Typography variant="label-02" onDark>
            {config.tenantUnit} - {config.tenant}
          </Typography>
        </div>
        <Switcher aria-label="Switcher Container" expanded={isSideNavExpanded}>
          <SwitcherDivider />
          <SwitcherItem
            data-autoid="dds--privacy-cp__link"
            // The below function will open the cookie preferences dialog box from the "More options" button
            // in IBM privacy banner
            onClick={() => {
              (window as any)._dl?.fn?.trustarc?.cookiePreferencesClick?.();
            }}
            aria-label={t('in-components:mainNavigation.profileMenu_privacy')}
          >
            <Typography variant="label-02" onDark>
              {t('in-components:mainNavigation.profileMenu_privacy')}
            </Typography>
          </SwitcherItem>
          <SwitcherDivider />
          {tenantSwitcherEnabled ? (
            <SwitcherItem
              target="_blank"
              href={tenantSwitcherLink}
              onClick={() => {
                trackCta(PROFILE_MENU_SWITCH_TENANT_OR_UNIT_CLICK);
                onClickSideNavExpand();
              }}
              aria-label={t('in-components:mainNavigation.profileMenu_switchUnitOrTenant')}
            >
              <Stack direction="horizontal" gap="xsmall" align="center">
                <SvgIcon type="lib_views_external_link" size="xs" color="white" />
                <Typography variant="label-02" onDark>
                  {t('in-components:mainNavigation.profileMenu_switchUnitOrTenant')}
                </Typography>
              </Stack>
            </SwitcherItem>
          ) : null}
          {tenantSwitcherEnabled && <SwitcherDivider />}
          <SwitcherItem href="#" onClick={signOut} aria-label={t('in-components:mainNavigation.profileMenu_logOut')}>
            <Stack direction="horizontal" gap="xsmall" align="center">
              <SvgIcon type="lib_log_out" size="xs" color="white" />
              <Typography variant="label-02" onDark>
                {t('in-components:mainNavigation.profileMenu_logOut')}
              </Typography>
            </Stack>
          </SwitcherItem>
        </Switcher>
      </Stack>
    </div>
  );
}
