/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { forwardRef, useState, useEffect } from 'react';

import { CopyButton } from '@instana/carbon';

import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { t } from 'in-i18n';

export interface CopyToClipBoardIconButtonProps {
  disabled?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
  getText?: () => string;
  targetId?: string;
}

async function writeClipboardText(text: string) {
  await navigator.clipboard.writeText(text);
}

export default forwardRef(function CopyToClipboardIconButton(
  props: CopyToClipBoardIconButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const { getText, targetId } = props;
  const [copied, setCopied] = useState(false);
  const [copy, setCopy] = useState(false);

  useEffect(() => {
    if (copy) {
      try {
        setCopy(false);
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
          writeClipboardText(text).then(() => setCopied(true));
        }
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
  }, [copy, getText, targetId]);

  if (props.disabled) {
    return <CopyButton disabled id="copy-action" size="sm" ref={ref} />;
  }

  return (
    <CopyButton
      id="copy-action"
      ref={ref}
      feedback={copied ? t('in-components:copyToClipboardCopied') : undefined}
      onClick={() => {
        setCopy(true);
      }}
      iconDescription={t('in-components:tooltipCopyToClipboard')}
      size="sm"
    />
  );
});
