/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef, useState, useEffect } from 'react';

import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { compositeRef } from 'in-services/util/react';
import { t } from 'in-i18n';

export interface CopyToClipboardProps {
  getText?: () => string;
  targetId?: string;
  children: (ref: React.ForwardedRef<HTMLButtonElement>) => JSX.Element;
  successText?: string;
}

export default forwardRef<HTMLButtonElement, CopyToClipboardProps>(function CopyToClipboard(
  { getText, targetId, children, successText }: CopyToClipboardProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const [button, setButton] = useState<HTMLButtonElement>();

  useEffect(() => {
    function handleClick() {
      let text = null;
      if (getText) {
        text = getText();
      } else if (targetId) {
        const element = document.getElementById(targetId);
        if (element) {
          text = element.textContent;
        }
      }
      if (text) {
        writeClipboardText(text).then(() => addCopiedToClipboardMessage(successText));
      }
    }
    if (button) {
      button.addEventListener('click', handleClick);
      return () => button.removeEventListener('click', handleClick);
    }
    return () => {};
  }, [targetId, getText, button, successText]);

  return children(compositeRef(setButton, ref));
});

async function writeClipboardText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    addMessage(
      {
        type: 'info',
        timeout: 2000,
        content: t('in-components:copyToClipboardPressToCopy')
      },
      'copyToClipboard'
    );
  }
}

export function addCopiedToClipboardMessage(content = t('in-components:copyToClipboardCopied')) {
  addMessage(
    {
      type: 'info',
      timeout: 2000,
      title: t('in-components:copyToClipboard'),
      content
    },
    'copyToClipboard'
  );
}
