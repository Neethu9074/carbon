/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack } from '@instana/components';
import { t } from '@instana/i18n-react';

// @ts-expect-error no declaration file
import { showReleaseNotes } from 'in-stores/releaseNotes';
import { QuickLinkButton } from 'in-plg/pages/WelcomePage/quickLinks/QuickLinkButton';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { releaseNotesEnabled } from 'in-services/featureFlags';

import locals from 'in-plg/pages/WelcomePage/quickLinks/QuickLinks.mless';

interface QuickLinksProps {
  enableQuickLinkForAgentAndUser: boolean;
}

export const QuickLinks = ({ enableQuickLinkForAgentAndUser }: QuickLinksProps) => {
  const { createHrefToPath } = useNavigation();
  return (
    <div className={locals.quickLinksWrapperStyle}>
      <Stack gap="disabled" direction="horizontal">
        {enableQuickLinkForAgentAndUser && (
          <QuickLinkButton
            icon="lib_actions_settings"
            iconDescription={t('in-plg:welcomepage.quickLinks.iconDescriptions.settings')}
            buttonName={t('in-plg:welcomepage.quickLinks.buttonNames.deployAgent')}
            href={createHrefToPath('/agents/installation')}
          />
        )}
        {enableQuickLinkForAgentAndUser && (
          <QuickLinkButton
            icon="lib_actions_user"
            iconDescription={t('in-plg:welcomepage.quickLinks.iconDescriptions.user')}
            buttonName={t('in-plg:welcomepage.quickLinks.buttonNames.addUser')}
            href={createHrefToPath('/config/team/accessControl/users')}
          />
        )}
        <QuickLinkButton
          icon="lib_views_external_link"
          iconDescription={t('in-plg:welcomepage.quickLinks.iconDescriptions.externalLink')}
          buttonName={t('in-plg:welcomepage.quickLinks.buttonNames.documentation')}
          onClick={() => {
            window.open('https://www.ibm.com/docs/en/obi/current', '_blank', 'noreferrer');
          }}
        />
        {releaseNotesEnabled && (
          <QuickLinkButton
            icon="lib_actions_result_new"
            iconDescription={t('in-plg:welcomepage.quickLinks.iconDescriptions.resultNew')}
            buttonName={t('in-plg:welcomepage.quickLinks.buttonNames.releaseNotes')}
            onClick={() => {
              showReleaseNotes();
            }}
          />
        )}
      </Stack>
    </div>
  );
};
