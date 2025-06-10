/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import classNames from 'classnames';
import React from 'react';

import locals from './PromptLibraryResponse.mless';

// import { t } from 'in-i18n';

export default function PromptLibraryResponse({ instance }) {
  const buttonStyle =
    'WAC__button-0 cds--chat-btn cds--chat-btn--quick-action cds--btn cds--btn--sm cds--layout--size-sm cds--btn--ghost';

  return (
    <button
      className={classNames(buttonStyle, locals.promptButton)}
      onClick={() => {
        const customPanel = instance?.customPanels?.getPanel();
        const panelOptions = {
          title: 'Prompt library'
        };
        customPanel.open(panelOptions);
      }}
    >
      {'Prompt library'}
    </button>
  );
}
