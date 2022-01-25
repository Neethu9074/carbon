/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIconSizes } from '@instana/components';

// @ts-expect-error
import CopyToClipboard from 'in-components/CopyToClipboard';
import IconButton from 'in-components/IconButton/IconButton';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

export interface CopyColumnProps {
  message: string;
}

export function CopyButton({ message }: CopyColumnProps) {
  return (
    <Tooltip content={t('in-logging:tooltipCopyToClipboard')}>
      <CopyToClipboard getText={() => message}>
        {(copyToClipboardRef: React.MutableRefObject<HTMLButtonElement>) => (
          <IconButton ref={copyToClipboardRef} iconSize={SvgIconSizes.xs} type="lib_actions_copy" />
        )}
      </CopyToClipboard>
    </Tooltip>
  );
}
