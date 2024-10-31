/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { Ref, forwardRef, useState } from 'react';

import { IconButton } from '@instana/components';

import { unmaskApiToken } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/api';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { addCopiedToClipboardMessage } from 'in-components/CopyToClipboard';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { t } from 'in-i18n';

export interface AsyncTokenCopyButtonProps {
  internalId: string;
  token: string;
  updateToken: (token: any) => void;
}

export default forwardRef(function AsyncTokenCopyButton(
  { internalId, token, updateToken }: AsyncTokenCopyButtonProps,
  ref: Ref<HTMLButtonElement>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [isMasked, setIsMasked] = useState(true);

  return (
    <IconButton
      ref={ref}
      type={getIcon()}
      iconSpinning={isLoading}
      onClick={e => {
        stopPropagationAndPreventDefault(e);
        if (isLoading) {
          return;
        }

        if (isMasked) {
          setIsLoading(true);
          const unMaskedToken$ = unmaskApiToken(internalId);
          unMaskedToken$.once(
            response => {
              updateToken(response.body);
              setIsLoading(false);
              setIsMasked(false);
            },
            () => addErrorMessage()
          );
        } else {
          navigator.clipboard.writeText(token).catch(() => addErrorMessage());
          addCopiedToClipboardMessage();
        }
      }}
    />
  );

  function getIcon() {
    if (isLoading) {
      return 'lib_actions_loading';
    }

    if (isMasked) {
      return 'lib_views_show';
    }

    return 'lib_actions_copy';
  }

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
