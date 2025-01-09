/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactElement } from 'react';

import { Button, ButtonProps } from '@instana/components';

import { t } from 'in-i18n';

export interface CancelButtonProps extends Partial<ButtonProps> {
  isSaving?: boolean;
  children?: string | ReactElement;
}

export default function CancelButton({
  children = t('forms.actions.cancel'),
  kind = 'secondary',
  onClick,
  isSaving,
  ...otherProps
}: CancelButtonProps) {
  const disabled = isSaving || otherProps.disabled;
  return (
    <Button {...otherProps} onClick={disabled ? undefined : onClick} disabled={disabled} kind={kind}>
      {children}
    </Button>
  );
}
