/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import classNames from 'classnames';
import React from 'react';

import { t } from 'in-i18n';

import locals from './PromptLibraryResponse.mless';

export default function PromptLibraryResponse({ instance }) {
  const buttonStyle =
    'WAC__button-0 cds--chat-btn cds--chat-btn--quick-action cds--btn cds--btn--sm cds--layout--size-sm cds--btn--ghost';

  return (
    <button
      className={classNames(buttonStyle, locals.promptButton)}
      onClick={() => {
        const customPanel = instance?.customPanels?.getPanel();
        const panelOptions = {
          title: t('in-events:aichat.promptLibrary')
        };
        customPanel.open(panelOptions);
      }}
    >
      {t('in-events:aichat.promptLibrary')}
    </button>
  );
}
