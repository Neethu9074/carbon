/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import {
  CarbonSwitcher as Switcher,
  CarbonSwitcherItem as SwitcherItem,
  CarbonSwitcherDivider as SwitcherDivider,
  Typography,
  SvgIcon
} from '@instana/components';
import { t } from '@instana/i18n-react';

import { userSettingsProfile } from 'in-settings/navigation/paths';
import { tenantSwitcherEnabled } from 'in-services/featureFlags';
import config from 'in-services/config';
import { user } from 'in-stores/user';

import local from './ProfileMenu.mless';

interface ProfileMenuProps {
  isSideNavExpanded: boolean;
}

function ProfileMenu({ isSideNavExpanded }: ProfileMenuProps) {
  const tenantSwitcherLink = `https://${config.tenantUnitDomainSuffix}/tenantSwitcher`;

  const signOut = () => {
    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/auth/signOut';
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="profileMenu">
      <Switcher aria-label="Switcher Container" expanded={isSideNavExpanded}>
        <SwitcherItem
          aria-label="header"
          className={classNames(local.profileMenu_header, local.profileMenu_switcherItemLabel)}
        >
          <Typography variant="heading-03">
            <label className={local.profileMenu_fullName}>{user?.fullName}</label>
          </Typography>
          <label className={local.profileMenu_label}>{user?.email}</label>
        </SwitcherItem>
        <SwitcherItem aria-label="profileLink" href={`#${userSettingsProfile}`}>
          <span className={classNames(local.profileMenu_profileLink, local.profileMenu_label)}>
            {t('in-components:mainNavigation.profileMenu_profileLink')}
          </span>
        </SwitcherItem>
        <SwitcherDivider />
        <SwitcherItem aria-label="unitTenantName" className={local.profileMenu_switcherItemLabel}>
          <label className={local.profileMenu_label}>
            {t('in-components:mainNavigation.profileMenu_unitName_tenantName')}
          </label>
        </SwitcherItem>
        <SwitcherItem aria-label="tenantUnit" className={local.profileMenu_switcherItemLabel}>
          <label className={local.profileMenu_title}>
            {config.tenantUnit} - {config.tenant}
          </label>
        </SwitcherItem>
        <SwitcherDivider />
        {tenantSwitcherEnabled ? (
          <SwitcherItem href={tenantSwitcherLink} aria-label="switchUnitOrTenant">
            <span
              className={classNames(local.profileMenu_switcherItemLink, local.profileMenu_title)}
              id="profileMenu-switchUnitOrTenant"
            >
              <SvgIcon type="lib_views_external_link" size="xs" />
              {t('in-components:mainNavigation.profileMenu_switchUnitOrTenant')}
            </span>
          </SwitcherItem>
        ) : null}
        {tenantSwitcherEnabled && <SwitcherDivider />}
        <SwitcherItem onClick={() => signOut()} aria-label="logOut">
          <span
            className={classNames(local.profileMenu_switcherItemLink, local.profileMenu_title)}
            id="profileMenu-sign-out"
          >
            <SvgIcon type="lib_log_out" size="xs" /> {t('in-components:mainNavigation.profileMenu_logOut')}
          </span>
        </SwitcherItem>
      </Switcher>
    </div>
  );
}

export default ProfileMenu;
