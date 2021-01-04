import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import { refreshWindowSizeDependingState } from 'in-services/browser';
import useUrlState from 'in-hooks/useUrlState';

import locals from './WithTvMode.mless';

let disableTvModeInternal;
const messageId = 'tvmode';

export default function WithTvMode({ children, urlParameter: { path, name } }) {
  const [{ enabled }, onChange] = useUrlState({
    bind: [
      {
        path,
        name,
        as: 'enabled',
        parser: v => v === 'true',
        initialState: false
      }
    ]
  });

  const setEnabled = useCallback(
    enabled => {
      onChange({ enabled });
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
    },
    [onChange]
  );

  useEffect(() => {
    disableTvModeInternal = () => setEnabled(false);
    return () => {
      disableTvModeInternal = null;
    };
  }, [setEnabled]);

  return <div className={enabled ? locals.tvMode : null}>{children({ enabled, setEnabled })}</div>;
}

WithTvMode.propTypes = {
  children: PropTypes.func.isRequired,
  urlParameter: PropTypes.shape({
    path: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired
};

export function disableTvMode() {
  if (disableTvModeInternal) {
    disableTvModeInternal();
  }
}
