/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { forwardRef, useState } from 'react';

import { fromPromise } from '@instana/observables';

import { unmaskApiToken } from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/api';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { addCopiedToClipboardMessage } from 'in-components/CopyToClipboard';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import IconButton from 'in-components/IconButton';
import { t } from 'in-i18n';

export default forwardRef(function AsyncTokenCopyButton({ internalId }, ref) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <IconButton
      ref={ref}
      type={isLoading ? 'lib_actions_loading' : 'lib_actions_copy'}
      iconSpinning={isLoading}
      onClick={e => {
        stopPropagationAndPreventDefault(e);
        setIsLoading(true);
        const unMaskToken$ = unmaskApiToken(internalId).flatMap(response =>
          fromPromise(navigator.clipboard.writeText(response.body))
        );
        unMaskToken$.errors().once(() => {
          setIsLoading(false);
          addErrorMessage();
        });
        unMaskToken$.once(() => {
          setIsLoading(false);
          addCopiedToClipboardMessage();
        });
      }}
    />
  );

  function addErrorMessage() {
    addMessage(
      {
        type: 'warning',
        timeout: 2000,
        content: t('in-settings:tabs.copyApiTokenToClipboardError')
      },
      'copyToClipboardError'
    );
  }
});
