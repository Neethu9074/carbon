/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { IconButton } from '@instana/components';

import CopyToClipboard from 'in-components/CopyToClipboard';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

export interface CopyColumnProps {
  message: string;
  className?: string;
}

export function CopyButton({ message, className }: CopyColumnProps) {
  return (
    <Tooltip content={t('in-synthetics:tooltipCopyToClipboard')}>
      <CopyToClipboard getText={() => message}>
        {(copyToClipboardRef: React.ForwardedRef<HTMLButtonElement>) => (
          <IconButton
            data-testid="copy-button"
            color="var(--ids-color-option-neutral-900)"
            className={className}
            ref={copyToClipboardRef}
            iconSize={'xs'}
            type="lib_actions_copy"
            onClick={e => {
              e.stopPropagation();
            }}
          />
        )}
      </CopyToClipboard>
    </Tooltip>
  );
}
