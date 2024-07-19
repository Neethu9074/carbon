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
  SvgIcon,
  Link
} from '@instana/components';
import { t } from '@instana/i18n-react';

import { userSettingsProfile } from 'in-settings/navigation/paths';
import { tenantSwitcherEnabled } from 'in-services/featureFlags';
import config from 'in-services/config';
import { user } from 'in-stores/user';

import local from './ProfileMenu.mless';

interface ProfileMenuProps {
  isSideNavExpanded: boolean;
  onClickSideNavExpand?: () => void;
}

function ProfileMenu({ isSideNavExpanded, onClickSideNavExpand }: ProfileMenuProps) {
  const tenantSwitcherLink = `https://${config.tenantUnitDomainSuffix}/tenantSwitcher`;

  const signOut = () => {
    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/auth/signOut';
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className={local.profileMenu}>
      <Switcher aria-label="Switcher Container" expanded={isSideNavExpanded}>
        <div aria-label="header" className={local.profileMenu_header}>
          <Typography variant="heading-03">
            <span className={local.profileMenu_fullName}>{user?.fullName}</span>
          </Typography>
          <p className={local.profileMenu_label}>{user?.email}</p>
          <Link
            aria-label="profileLink"
            href={`#${userSettingsProfile}`}
            onClick={onClickSideNavExpand}
            className={classNames(local.profileMenu_profileLink, local.profileMenu_label)}
          >
            {t('in-components:mainNavigation.profileMenu_profileLink')}
          </Link>
        </div>
        <SwitcherDivider />
        <div aria-label="unitTenantName" className={local.profileMenu_unitTenantSection}>
          <p className={local.profileMenu_label}>{t('in-components:mainNavigation.profileMenu_unitName_tenantName')}</p>
          <p className={local.profileMenu_title}>
            {config.tenantUnit} - {config.tenant}
          </p>
        </div>
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
