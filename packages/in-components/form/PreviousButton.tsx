/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactElement } from 'react';

import { Button, ButtonProps } from '@instana/components';

import { t } from 'in-i18n';

export interface PreviousButtonProps extends Partial<ButtonProps> {
  isDisabled?: boolean;
  children?: string | ReactElement;
}

export default function PreviousButton({
  children = t('forms.actions.previous'),
  kind = 'action',
  onClick,
  isDisabled,
  ...otherProps
}: PreviousButtonProps) {
  const disabled = isDisabled;
  return (
    <Button {...otherProps} onClick={disabled ? undefined : onClick} disabled={disabled} kind={kind}>
      {children}
    </Button>
  );
}
