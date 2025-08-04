/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

const AboutInstanaDialog = () => import(/* webpackChunkName: "global" */ 'in-components/AboutInstanaDialog');
import React from 'react';

import { MenuItem, SideNavMenu, SvgIcon, CarbonSideNavLink, useUIShellContext } from '@instana/components';

// @ts-expect-error no declaration file
import { showReleaseNotes } from 'in-stores/releaseNotes';
import { newOTelPageEnabled, releaseNotesEnabled } from 'in-services/featureFlags';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { agentsPath } from 'in-stores/navigation/paths/mainPaths';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import AsyncComponent from 'in-components/AsyncComponent';
import { t } from 'in-i18n';

import local from './MoreMenuItem.mless';

export default function MoreMenuItem() {
  const [role] = useCurrentUserRole();
  const { matchLocation, createHrefToPath } = useNavigation();
  const { isSideNavExpanded } = useUIShellContext();

  return (
    <SideNavMenu
      isSideNavExpanded={isSideNavExpanded}
      renderIcon={() => <SvgIcon size="s" type="lib_menu_additional_resources" />}
      title={t('in-components:mainNavigation.viewSwitcherLabelMore')}
    >
      {/* Only show the Agents menu item if the new OpenTelemetry page is NOT enabled */}
      {role?.canConfigureAgents && !newOTelPageEnabled && (
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
        href="https://www.ibm.com/docs/en/instana-observability/latest"
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
