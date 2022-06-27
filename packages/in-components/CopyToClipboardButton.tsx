/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React, { forwardRef } from 'react';

import { Sizes, Kinds } from '@instana/components/types/components/Button/types';
import { Button } from '@instana/components';

import CopyToClipboard, { CopyToClipboardProps } from 'in-components/CopyToClipboard';
import { compositeRef } from 'in-services/util/react';
import { t } from 'in-i18n';

export interface CopyToClipBoardButtonProps extends Partial<CopyToClipboardProps> {
  disabled?: boolean;
  size?: keyof typeof Sizes;
  kind?: keyof typeof Kinds;
  className?: string;
}

export default forwardRef(function CopyToClipboardButton(props: CopyToClipBoardButtonProps, ref) {
  if (props.disabled) {
    return (
      <Button
        disabled
        size={props.size || 'normal'}
        kind={props.kind || 'create'}
        className={props.className}
        ref={ref}
      >
        {t('in-components:copyToClipboardButtonCopy')}
      </Button>
    );
  }

  return (
    <CopyToClipboard {...props}>
      {copyToClipboardRef => (
        <Button
          ref={compositeRef(copyToClipboardRef, ref)}
          size={props.size || 'normal'}
          kind={props.kind || 'create'}
          className={props.className}
        >
          {props.children || t('in-components:copyToClipboardButtonCopy')}
        </Button>
      )}
    </CopyToClipboard>
  );
});
