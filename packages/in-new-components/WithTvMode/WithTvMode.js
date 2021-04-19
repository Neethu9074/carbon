/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import { addMessage, removeMessage } from 'in-components/MessageFlyout/stores/messages';
import { refreshWindowSizeDependingState } from 'in-services/browser';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

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
            content: t('in-new-components:withTvMode.setEnabledMessagePressESCToDisableTVMode')
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

  const [wrapperDomNode, setWrapperDomNode] = useState();

  return (
    <div className={enabled ? locals.tvMode : null} ref={setWrapperDomNode}>
      {wrapperDomNode && children({ enabled, setEnabled, wrapperDomNode })}
    </div>
  );
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
