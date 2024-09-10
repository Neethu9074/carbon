/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactElement, MouseEvent } from 'react';
import { Item } from 'formalistic';

import { Button, ButtonKinds, ButtonTypes } from '@instana/components';

import { t } from 'in-i18n';

export interface SaveButtonProps {
  children: string | ReactElement;
  className?: string;
  form?: Item;
  /**
   * Will be turned into form= attribute on the buttons. Can be used
   * to implement form controls outside of the <form /> HTML sub-tree.
   */
  formId?: string;
  icon?: string;
  isLoading?: boolean;
  isSaving?: boolean;
  disabled?: boolean;
  kind?: keyof typeof ButtonKinds;
  onClick?: (e: MouseEvent) => void;
  type?: keyof typeof ButtonTypes;
  autoFocus?: boolean;
}

export default function SaveButton({
  form,
  formId,
  isLoading,
  isSaving,
  children = t('forms.actions.save'),
  className,
  kind = 'create',
  icon,
  type = 'submit',
  onClick,
  autoFocus,
  disabled
}: SaveButtonProps) {
  return (
    <Button
      formId={formId}
      kind={kind}
      type={type}
      onClick={onClick}
      disabled={(form && !form.hierarchyValid && form.touched) || isLoading || isSaving || disabled}
      icon={isSaving ? 'lib_actions_loading' : icon}
      iconSpinning={isSaving}
      className={className}
      // @ts-expect-error Property 'autoFocus' does not exist on type 'IntrinsicAttributes & PropsType & RefAttributes<any>'.
      autoFocus={autoFocus}
    >
      {children}
    </Button>
  );
}
