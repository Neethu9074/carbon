/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import Clipboard from 'clipboard';

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
  const [button, setButton] = useState<string | HTMLButtonElement | NodeListOf<HTMLButtonElement>>('');
  let clipboard = useRef<Clipboard>();

  useEffect(() => {
    if (getText) {
      clipboard.current = new Clipboard(button, {
        text: () => getText()
      });
    } else if (targetId) {
      clipboard.current = new Clipboard(button, {
        target: (currentElement: HTMLButtonElement) => document.getElementById(targetId) || currentElement
      });
    }

    if (clipboard.current) {
      clipboard.current.on('success', e => {
        addCopiedToClipboardMessage(successText);
        e.clearSelection();
      });

      clipboard.current.on('error', () => {
        addMessage(
          {
            type: 'info',
            timeout: 2000,
            content: t('in-components:copyToClipboardPressToCopy')
          },
          'copyToClipboard'
        );
      });
    }

    return () => {
      if (clipboard.current) {
        clipboard.current.destroy();
      }
    };
  }, [targetId, getText, button, clipboard, successText]);

  return children(compositeRef(setButton, ref));
});

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
