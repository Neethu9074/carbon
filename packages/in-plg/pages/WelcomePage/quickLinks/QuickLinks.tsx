/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack } from '@instana/components';
import { t } from '@instana/i18n-react';

import {
  WELCOME_PAGE_ADD_USER_CLICK,
  WELCOME_PAGE_DEPLOY_AGENT_CLICK,
  WELCOME_PAGE_IBM_DOCUMENTATION_CLICK,
  WELCOME_PAGE_RELEASE_NOTES_CLICK,
  WELCOME_PAGE_WHATS_NEW_LINK_CLICK
} from 'in-services/tracking/eventNames';
// @ts-expect-error no declaration file
import { showReleaseNotes } from 'in-stores/releaseNotes';
import { QuickLinkButton } from 'in-plg/pages/WelcomePage/quickLinks/QuickLinkButton';
import { securityAndAccessAccessControlUsers } from 'in-settings/navigation/paths';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { releaseNotesEnabled } from 'in-services/featureFlags';
import { getPageType } from 'in-plg/Demo/NewPlayWithHeader';
import { playwithEnabled } from 'in-services/featureFlags';
import { role } from 'in-stores/user';

import locals from 'in-plg/pages/WelcomePage/quickLinks/QuickLinks.mless';

export const QuickLinks = () => {
  const { createHrefToPath } = useNavigation();
  const { trackCta } = useSegmentTracking();
  const location = useLocation();
  return (
    <div className={locals.quickLinksWrapperStyle}>
      <Stack gap="disabled" direction="horizontal">
        {!playwithEnabled && role?.canConfigureAgents && (
          <QuickLinkButton
            icon="lib_actions_settings"
            iconDescription={t('in-plg:welcomepage.quickLinks.iconDescriptions.settings')}
            buttonName={t('in-plg:welcomepage.quickLinks.buttonNames.deployAgent')}
            href={createHrefToPath('/agents/installation')}
            onClick={() => {
              trackCta(WELCOME_PAGE_DEPLOY_AGENT_CLICK, getPageType(location.pathname));
            }}
          />
        )}
        {!playwithEnabled && role?.canConfigureUsers && (
          <QuickLinkButton
            icon="lib_actions_user"
            iconDescription={t('in-plg:welcomepage.quickLinks.iconDescriptions.user')}
            buttonName={t('in-plg:welcomepage.quickLinks.buttonNames.addUser')}
            href={createHrefToPath(securityAndAccessAccessControlUsers)}
            onClick={() => {
              trackCta(WELCOME_PAGE_ADD_USER_CLICK, getPageType(location.pathname));
            }}
          />
        )}
        <QuickLinkButton
          icon="lib_views_external_link"
          iconDescription={t('in-plg:welcomepage.quickLinks.iconDescriptions.externalLink')}
          buttonName={t('in-plg:welcomepage.quickLinks.buttonNames.documentation')}
          onClick={() => {
            trackCta(WELCOME_PAGE_IBM_DOCUMENTATION_CLICK, getPageType(location.pathname));
            window.open('https://www.ibm.com/docs/en/obi/current', '_blank', 'noreferrer');
          }}
        />
        {releaseNotesEnabled && (
          <QuickLinkButton
            icon="lib_actions_result_new"
            iconDescription={t('in-plg:welcomepage.quickLinks.iconDescriptions.resultNew')}
            buttonName={t('in-plg:welcomepage.quickLinks.buttonNames.releaseNotes')}
            onClick={() => {
              trackCta(WELCOME_PAGE_RELEASE_NOTES_CLICK, getPageType(location.pathname));
              showReleaseNotes();
            }}
          />
        )}
        <QuickLinkButton
          icon="lib_views_external_link"
          iconDescription={t('in-plg:welcomepage.quickLinks.iconDescriptions.whatsNewLink')}
          buttonName={t('in-plg:welcomepage.quickLinks.buttonNames.whatsNewLink')}
          onClick={() => {
            trackCta(WELCOME_PAGE_WHATS_NEW_LINK_CLICK, getPageType(location.pathname));
            window.open('https://community.ibm.com/community/user/instana/participate/blogs ', '_blank', 'noreferrer');
          }}
        />
      </Stack>
    </div>
  );
};
