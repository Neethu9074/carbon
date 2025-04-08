/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error promise loader
import AboutInstanaDialog from 'promise-loader?global!in-components/AboutInstanaDialog';
import React from 'react';

import { MenuItem, SideNavMenu, SvgIcon } from '@instana/components';

import { tenantSwitcherEnabled, userProfileMenuEnabled, releaseNotesEnabled } from 'in-services/featureFlags';
// @ts-expect-error no declaration file
import { showReleaseNotes } from 'in-stores/releaseNotes';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { agentsPath } from 'in-stores/navigation/paths/mainPaths';
import AsyncComponent from 'in-components/AsyncComponent';
import { role, user } from 'in-stores/user';
import config from 'in-services/config';
import { t } from 'in-i18n';

import local from './MoreMenuItem.mless';

const signOut = () => {
  const form = document.createElement('form');
  form.method = 'post';
  form.action = '/auth/signOut';
  document.body.appendChild(form);
  form.submit();
};

interface MoreMenuItemProps {
  isSideNavExpanded: boolean;
}

export default function MoreMenuItem({ isSideNavExpanded }: MoreMenuItemProps) {
  const { matchLocation, createHrefToPath } = useNavigation();

  const tenantSwitcherLink = `https://${config.tenantUnitDomainSuffix}/tenantSwitcher`;

  return (
    <SideNavMenu
      isSideNavExpanded={isSideNavExpanded}
      renderIcon={() => <SvgIcon color="white" size="s" type="lib_menu_additional_resources" />}
      title={t('in-components:mainNavigation.viewSwitcherLabelMore')}
    >
      {!userProfileMenuEnabled && tenantSwitcherEnabled ? (
        <MenuItem
          id="main-nav-tenants"
          key="main-nav-tenants"
          label={t('in-components:mainNavigation.viewSwitcherLabelTenants')}
          openInNewTab
          href={tenantSwitcherLink}
        />
      ) : null}
      {role?.canConfigureAgents ? (
        <MenuItem
          id="main-nav-agents"
          key="main-nav-agents"
          label={t('in-components:mainNavigation.viewSwitcherLabelAgents')}
          href={createHrefToPath(agentsPath)}
          isActive={matchLocation(agentsPath)}
        />
      ) : null}
      {releaseNotesEnabled ? (
        <MenuItem
          id="main-nav-release-notes"
          key="main-nav-release-notes"
          onClick={() => {
            showReleaseNotes();
          }}
          label={t('in-components:mainNavigation.viewSwitcherLabelReleaseNotes')}
        />
      ) : null}
      <MenuItem
        id="main-nav-documentation"
        key="main-nav-documentation"
        label={t('in-components:mainNavigation.viewSwitcherLabelDocumentation')}
        openInNewTab
        href="https://www.ibm.com/docs/en/obi/current"
      />
      <MenuItem
        id="main-nav-support"
        key="main-nav-support"
        label={t('in-components:mainNavigation.viewSwitcherLabelSupport')}
        openInNewTab
        href="https://www.ibm.com/mysupport/s/?language=en_US"
      />
      <MenuItem
        id="main-nav-about"
        key="main-nav-about"
        onClick={() => {
          addActiveDialog(<AsyncComponent component={AboutInstanaDialog} />);
        }}
        label={t('in-components:mainNavigation.viewSwitcherLabelAboutInstana')}
      />
      {!userProfileMenuEnabled && (
        <div key="main-nav-sign-out" className={local.signOutButton}>
          <MenuItem
            id="main-nav-sign-out"
            onClick={signOut}
            label={
              <>
                <div>{t('in-components:mainNavigation.viewSwitcherButtonSignOut')}</div>
                <div className={local.emailAddress}>{user?.email}</div>
              </>
            }
          />
        </div>
      )}
    </SideNavMenu>
  );
}
