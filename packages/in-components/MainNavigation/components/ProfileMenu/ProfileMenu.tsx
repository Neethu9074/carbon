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
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';
import { t } from '@instana/i18n-react';

import {
  PROFILE_MENU_LOGOUT_CLICK,
  PROFILE_MENU_SWITCH_TENANT_OR_UNIT_CLICK,
  PROFILE_MENU_USER_PROFILE_CLICK,
  PROFILE_MENU_SAAS_CONSOLE_CLICK
} from 'in-services/tracking/tracking';
import { rbacTeamsEnabled, tealiumPrivacyEnabled, tenantSwitcherEnabled } from 'in-services/featureFlags';
import TeamFocusDropdown from 'in-components/MainNavigation/components/ProfileMenu/TeamFocusDropdown';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { userSettingsProfile } from 'in-settings/navigation/paths';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import { getTeamsByUserId } from 'in-api/teams';
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
  const activeLicenseType = config.activeLicenseType;
  const { isMcspEnvironment, mcspSaasConsoleUrl, regionName, ownerName } = config.mcspDetails ?? {};
  //// Show MCSP menu items only if the environment is MCSP
  // and the active license type is either 'hostBasedPaid' or 'paidPerUse'.
  const shouldShowMcspMenuItems =
    isMcspEnvironment && (activeLicenseType === 'hostBasedPaid' || activeLicenseType === 'paidPerUse');

  const teamsObservable = useObservable(rbacTeamsEnabled ? getTeamsByUserId() : just(null), []) ?? pendingResult;
  const teams = teamsObservable?.data ?? [];
  const isTeamsLoading = isLoading(teamsObservable);

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
        <SwitcherDivider className={local.profileMenu_switcherDivider} />
        {rbacTeamsEnabled && !isTeamsLoading && (
          <div className={local.profileMenu_teamFocusSection}>
            <TeamFocusDropdown teams={teams} />
          </div>
        )}
        {rbacTeamsEnabled && <SwitcherDivider className={local.profileMenu_switcherDivider} />}
        <div className={local.profileMenu_unitTenantSection}>
          <Typography variant="label-01" onDark>
            <label className={local.profileMenu_label}>
              {shouldShowMcspMenuItems
                ? t('in-components:mainNavigation.profileMenu_instanceName')
                : t('in-components:mainNavigation.profileMenu_unitName_tenantName')}
            </label>
          </Typography>
          <Spacer vertical="small" />
          <Typography variant="label-02" onDark>
            {config.tenantUnit} - {config.tenant}
          </Typography>
        </div>
        {shouldShowMcspMenuItems ? (
          <div className={local.profileMenu_unitTenantSection}>
            <Typography variant="label-01" onDark>
              <label className={local.profileMenu_label}>{t('in-components:mainNavigation.profileMenu_region')}</label>
            </Typography>
            <Spacer vertical="small" />
            <Typography variant="label-02" onDark>
              {regionName}
            </Typography>
          </div>
        ) : null}
        {shouldShowMcspMenuItems ? (
          <div className={local.profileMenu_unitTenantSection}>
            <Typography variant="label-01" onDark>
              <label className={local.profileMenu_label}>
                {t('in-components:mainNavigation.profileMenu_instanceOwner')}
              </label>
            </Typography>
            <Spacer vertical="small" />
            <Typography variant="label-02" onDark>
              {ownerName}
            </Typography>
          </div>
        ) : null}
        <Switcher aria-label="Switcher Container" expanded={isSideNavExpanded}>
          <SwitcherDivider className={local.profileMenu_switcherDivider} />
          {tealiumPrivacyEnabled ? (
            <SwitcherItem
              href="#"
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
          ) : null}
          {tealiumPrivacyEnabled ? <SwitcherDivider className={local.profileMenu_switcherDivider} /> : null}
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
                <span className="cds--visually-hidden">{t('in-components:accessibility.opensNewTab')}</span>
              </Stack>
            </SwitcherItem>
          ) : null}
          {tenantSwitcherEnabled && <SwitcherDivider className={local.profileMenu_switcherDivider} />}
          {shouldShowMcspMenuItems ? (
            <SwitcherItem
              target="_blank"
              href={mcspSaasConsoleUrl}
              onClick={() => {
                trackCta(PROFILE_MENU_SAAS_CONSOLE_CLICK); // Add tracking for SaaS Console click
                onClickSideNavExpand?.(); // Ensure side nav expands if needed
              }}
              aria-label={t('in-components:mainNavigation.profileMenu_saasConsole')}
            >
              <Stack direction="horizontal" gap="xsmall" align="center">
                <SvgIcon type="lib_actions_settings" size="xs" color="white" />
                <Typography variant="body-compact-01" onDark>
                  {t('in-components:mainNavigation.profileMenu_saasConsole')}
                </Typography>
              </Stack>
            </SwitcherItem>
          ) : null}
          {shouldShowMcspMenuItems && <SwitcherDivider className={local.profileMenu_switcherDivider} />}
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
