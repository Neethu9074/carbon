import React, { useState } from 'react';

import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import { refreshWindowSizeDependingState } from 'in-services/browser';
import LifecycleObserver from 'in-components/LifecycleObserver';

import locals from './WithTvMode.mless';

let disableTvModeInternal;
const messageId = 'tvmode';

export default function WithTvMode({ children }) {
  const [enabled, setEnabledInternal] = useState(false);

  return (
    <div className={enabled ? locals.tvMode : null}>
      <LifecycleObserver
        onDidMount={setGlobalDisableHandler}
        onDidUpdate={setGlobalDisableHandler}
        onWillUnmount={unsetGlobalDisableHandler}
      />
      {children({ enabled, setEnabled })}
    </div>
  );

  function setEnabled(enabled) {
    setEnabledInternal(enabled);
    if (enabled) {
      addMessage(
        {
          type: 'info',
          timeout: 5000,
          content: 'Press ESC to disable TV mode.'
        },
        messageId
      );
    } else {
      removeMessage(messageId);
    }
    refreshWindowSizeDependingState();
    setTimeout(refreshWindowSizeDependingState, 100);
  }

  function setGlobalDisableHandler() {
    disableTvModeInternal = () => setEnabled(false);
  }

  function unsetGlobalDisableHandler() {
    disableTvModeInternal = null;
  }
}

export function disableTvMode() {
  if (disableTvModeInternal) {
    disableTvModeInternal();
  }
}
