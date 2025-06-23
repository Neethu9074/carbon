/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Tag } from '@instana/carbon';

import { EVENT_AI_LIBRARY_RESPONSE_OPEN } from 'in-services/tracking/tracking';
import { handleTracking } from 'in-events/components/AIChat/utils';
import { t } from 'in-i18n';

import locals from './PromptLibraryResponse.mless';

export default function PromptLibraryResponse({ instance }) {
  return (
    <Tag
      size="lg"
      className={locals.tagStyle}
      onClick={() => {
        const customPanel = instance?.customPanels?.getPanel();
        const panelOptions = {
          title: t('in-events:aichat.promptLibrary')
        };
        customPanel.open(panelOptions);
        handleTracking(EVENT_AI_LIBRARY_RESPONSE_OPEN);
      }}
    >
      {t('in-events:aichat.promptLibrary')}
    </Tag>
  );
}
