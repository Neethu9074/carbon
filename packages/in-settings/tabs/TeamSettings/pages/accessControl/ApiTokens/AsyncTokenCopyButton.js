/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { forwardRef, useState } from 'react';

import { unmaskApiToken } from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/api';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { addCopiedToClipboardMessage } from 'in-components/CopyToClipboard';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import IconButton from 'in-new-components/IconButton';
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
        const unMaskToken$ = unmaskApiToken(internalId);
        unMaskToken$.errors().once(() => {
          setIsLoading(false);
          addErrorMessage();
        });
        unMaskToken$.once(response => {
          navigator.clipboard.writeText(response.body).then(
            () => {
              setIsLoading(false);
              addCopiedToClipboardMessage();
            },
            () => {
              setIsLoading(false);
              addErrorMessage();
            }
          );
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
