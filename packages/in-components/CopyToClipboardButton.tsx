/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';

import { Button, ButtonKinds, ButtonSizes } from '@instana/components';

import CopyToClipboard, { CopyToClipboardProps } from 'in-components/CopyToClipboard';
import { compositeRef } from 'in-services/util/react';
import { t } from 'in-i18n';

export interface CopyToClipBoardButtonProps extends Partial<CopyToClipboardProps> {
  disabled?: boolean;
  size?: keyof typeof ButtonSizes;
  kind?: keyof typeof ButtonKinds;
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
