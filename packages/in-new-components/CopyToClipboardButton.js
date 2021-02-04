/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { forwardRef } from 'react';
import { t } from 'in-i18n';

import CopyToClipboard from 'in-components/CopyToClipboard';
import { compositeRef } from 'in-services/util/react';
import Button from 'in-new-components/Button';

export default forwardRef(function CopyToClipboardButton(props, ref) {
  if (props.disabled) {
    return (
      <Button
        disabled
        size={props.size || 'normal'}
        kind={props.kind || 'create'}
        className={props.className}
        ref={ref}
      >
        {t('in-new-components:copyToClipboardButtonCopy')}
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
          {props.children || t('in-new-components:copyToClipboardButtonCopy')}
        </Button>
      )}
    </CopyToClipboard>
  );
});
