/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error promise loader
import AboutInstanaDialog from 'promise-loader?global!in-components/AboutInstanaDialog';
import React from 'react';

import { MenuItem, SideNavMenu, SvgIcon, CarbonSideNavLink } from '@instana/components';

// @ts-expect-error no declaration file
import { showReleaseNotes } from 'in-stores/releaseNotes';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { agentsPath } from 'in-stores/navigation/paths/mainPaths';
import { releaseNotesEnabled } from 'in-services/featureFlags';
import AsyncComponent from 'in-components/AsyncComponent';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import local from './MoreMenuItem.mless';

interface MoreMenuItemProps {
  isSideNavExpanded: boolean;
}

export default function MoreMenuItem({ isSideNavExpanded }: MoreMenuItemProps) {
  const { matchLocation, createHrefToPath } = useNavigation();

  return (
    <SideNavMenu
      isSideNavExpanded={isSideNavExpanded}
      renderIcon={() => <SvgIcon size="s" type="lib_menu_additional_resources" />}
      title={t('in-components:mainNavigation.viewSwitcherLabelMore')}
    >
      {role?.canConfigureAgents && (
        <MenuItem
          id="main-nav-agents"
          key="main-nav-agents"
          label={t('in-components:mainNavigation.viewSwitcherLabelAgents')}
          href={createHrefToPath(agentsPath)}
          isActive={matchLocation(agentsPath)}
        />
      )}
      {releaseNotesEnabled && (
        <MenuItem
          id="main-nav-release-notes"
          key="main-nav-release-notes"
          onClick={() => {
            showReleaseNotes();
          }}
          label={t('in-components:mainNavigation.viewSwitcherLabelReleaseNotes')}
        />
      )}
      <CarbonSideNavLink
        target="_blank"
        className={local.externalLink}
        id="main-nav-documentation"
        key="main-nav-documentation"
        href="https://www.ibm.com/docs/en/obi/current"
        renderIcon={() => <SvgIcon size="xs" type="lib_views_external_link" />}
      >
        <span>{t('in-components:mainNavigation.viewSwitcherLabelDocumentation')}</span>
        <span className="cds--visually-hidden">{t('in-components:accessibility.opensNewTab')}</span>
      </CarbonSideNavLink>
      <CarbonSideNavLink
        target="_blank"
        className={local.externalLink}
        id="main-nav-support"
        key="main-nav-support"
        href="https://www.ibm.com/mysupport/s/?language=en_US"
        renderIcon={() => <SvgIcon size="xs" type="lib_views_external_link" />}
      >
        <span>{t('in-components:mainNavigation.viewSwitcherLabelSupport')}</span>
        <span className="cds--visually-hidden">{t('in-components:accessibility.opensNewTab')}</span>
      </CarbonSideNavLink>
      <MenuItem
        id="main-nav-about"
        key="main-nav-about"
        onClick={() => {
          addActiveDialog(<AsyncComponent component={AboutInstanaDialog} />);
        }}
        label={t('in-components:mainNavigation.viewSwitcherLabelAboutInstana')}
      />
    </SideNavMenu>
  );
}
